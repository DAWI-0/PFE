<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Stade;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class ReservationController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'stade_id' => 'required|integer|exists:stades,id',
            'start_time' => 'required|date_format:Y-m-d\TH:i:s',
            'duration' => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:0',
            'status' => 'required|in:pending,confirmed,cancelled',
        ]);
        $validatedData['start_time'] = \Carbon\Carbon::createFromFormat('Y-m-d\TH:i:s', $validatedData['start_time'])->format('Y-m-d H:i:s');
        $reservation = Reservation::create($validatedData);

        return response()->json(['reservation' => $reservation], 201);
    }

    public function index()
    {
        $reservations = Reservation::all();
        foreach ($reservations as $reservation) {
            $reservation->user;
            $reservation->stade;
        }
        return response()->json($reservations);
    }

    public function show($id)
    {
        $stade = Stade::where("user_id", $id)->first();
        if (!$stade) {
            return response()->json(['message' => 'Stade not found'], 404);
        }
        $reservations = Reservation::where('stade_id', $stade->id)->get();
        foreach ($reservations as $reservation) {
            $reservation->user;
        }
        return response()->json($reservations);
    }

    public function showByStadeId($id)
    {
        $stade = Stade::find($id);
        if (!$stade) {
            return response()->json(['message' => 'Stade not found'], 404);
        }
        $reservations = Reservation::where('stade_id', $stade->id)->get();
        foreach ($reservations as $reservation) {
            $reservation->user;
        }
        return response()->json($reservations);
    }
    public function admin()
    {
        $reservations = Reservation::all();
        foreach ($reservations as $reservation) {
            $reservation->user;
        }
        return response()->json($reservations);
    }

    public function annuler($id)
    {
        $reservation = Reservation::where('id', $id)->first();
        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found'], 404);
        }
        $reservation->status = 'cancelled';
        $reservation->save();

        return response()->json(['message' => 'Reservation cancelled successfully']);
    }

    public function confirmer($id)
    {
        $reservation = Reservation::where('id', $id)->where('status', 'pending')->first();
        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found'], 404);
        }

        $stade = Stade::find($reservation->stade_id);
        if (!$stade) {
            return response()->json(['message' => 'Stade not found'], 404);
        }

        $reservation->status = 'confirmed';
        $reservation->save();

        $qrCodeData = [
            'reservation_id' => $reservation->id,
            'nom_du_stade' => $stade->name,
            'Date/Heure_de_Debut' => $reservation->start_time,
            'duree' => $reservation->duration,
        ];

        $pdfPath = 'receipts/reservation_' . $reservation->id . '.pdf';
        try {
            $qrCodeContent = json_encode($qrCodeData);
            Log::debug('QR Code Content: ' . $qrCodeContent);
            if (!$qrCodeContent) {
                throw new \Exception('Invalid QR code data');
            }

            $qrCodeSvg = QrCode::format('svg')->size(200)->generate($qrCodeContent);
            $qrCodeBase64 = base64_encode($qrCodeSvg);

            $pdfData = [
                'reservation_id' => $reservation->id,
                'stade_name' => $stade->name,
                'start_time' => $reservation->start_time,
                'duration' => $reservation->duration,
                'user_name' => $reservation->user->name,
                'qr_code_svg' => $qrCodeBase64,
            ];

            $pdf = Pdf::loadView('pdf.reservation_receipt', $pdfData);
            $pdfBinary = $pdf->output();

            Storage::disk('public')->put($pdfPath, $pdfBinary);
            $fullPath = Storage::disk('public')->path($pdfPath);

            $reservation->qr_code = $pdfPath;
            $reservation->save();

        } catch (\Exception $e) {
            Log::error('Failed to generate PDF: ' . $e->getMessage());
            return response()->json([
                'message' => 'Reservation confirmed, but PDF generation failed',
                'pdf_status' => 'PDF generation failed',
                'error_details' => $e->getMessage()
            ], 500);
        }

        $emailData = [
            'reservation_id' => $reservation->id,
            'stade_name' => $stade->name,
            'start_time' => $reservation->start_time,
            'duration' => $reservation->duration,
            'user_name' => $reservation->user->name
        ];

        try {
            Mail::send('emails.reservation_confirmation', $emailData, function ($message) use ($reservation, $fullPath) {
                $message->to($reservation->user->email)
                        ->subject('La confirmation de votre réservation');
                $message->attach($fullPath, [
                    'as' => 'reservation_' . $reservation->id . '.pdf',
                    'mime' => 'application/pdf',
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Failed to send confirmation email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Reservation confirmed successfully',
            'pdf_status' => 'PDF generated',
        ]);
    }

    public function ShowByUserId($id)
    {
        $reservations = Reservation::where('user_id', $id)->get();
        foreach ($reservations as $reservation) {
            $reservation->stade;
        }
        return response()->json($reservations);
    }
}
