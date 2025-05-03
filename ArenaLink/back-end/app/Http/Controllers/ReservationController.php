<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Stade;
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
            'heure_de_debut' => $reservation->start_time,
            'duree' => $reservation->duration,
        ];

        $qrCodePath = 'qrcodes/reservation_' . $reservation->id . '.png';
        try {
            $qrCodeContent = json_encode($qrCodeData);
            Log::debug('QR Code Content: ' . $qrCodeContent);
            if (!$qrCodeContent) {
                throw new \Exception('Invalid QR code data');
            }

            $directory = dirname(storage_path('app/public/' . $qrCodePath));
            if (!is_dir($directory)) {
                if (!mkdir($directory, 0755, true)) {
                    throw new \Exception('Failed to create QR code directory');
                }
            }

            if (!is_writable($directory)) {
                throw new \Exception('QR code directory is not writable');
            }

            $qrCodeBinary = QrCode::format('png')->size(300)->generate($qrCodeContent);

            Storage::disk('public')->put($qrCodePath, $qrCodeBinary);

            $fullPath = Storage::disk('public')->path($qrCodePath);
            Log::debug('QR Code Full Path: ' . $fullPath);
            if (!file_exists($fullPath) || filesize($fullPath) === 0) {
                throw new \Exception('QR code file was not created or is empty');
            }

            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mimeType = finfo_file($finfo, $fullPath);
            finfo_close($finfo);
            if ($mimeType !== 'image/png') {
                throw new \Exception('Generated QR code is not a valid PNG, MIME type: ' . $mimeType);
            }
        } catch (\Exception $e) {
            Log::error('Failed to generate QR code: ' . $e->getMessage());
            return response()->json([
                'message' => 'Reservation confirmed, but QR code generation failed',
                'qr_code_status' => 'QR code generation failed',
                'qr_code_path' => null,
                'error_details' => $e->getMessage()
            ], 500);
        }

        $reservation->qr_code = $qrCodePath;
        $reservation->save();

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
                if (file_exists($fullPath)) {
                    $message->attach($fullPath, [
                        'as' => 'reservation_' . $reservation->id . '.png',
                        'mime' => 'image/png',
                    ]);
                }
            });
        } catch (\Exception $e) {
            Log::error('Failed to send confirmation email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Reservation confirmed successfully',
            'qr_code_status' => file_exists($fullPath) ? 'QR code generated' : 'QR code generation failed',
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
