<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reçu de Réservation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            text-align: center;
        }
        .header {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .details {
            text-align: left;
            margin-bottom: 20px;
        }
        .details p {
            margin: 5px 0;
        }
        .qr-code {
            margin-top: 20px;
        }
        .qr-code img {
            width: 200px;
            height: 200px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Confirmation de Réservation</div>
        <div class="details">
            <p><strong>ID de Réservation :</strong> {{ $reservation_id }}</p>
            <p><strong>Nom du Stade :</strong> {{ $stade_name }}</p>
            <p><strong>Date et Heure de Début :</strong> {{ $start_time }}</p>
            <p><strong>Durée :</strong> {{ $duration }} heures</p>
            <p><strong>Nom de l'Utilisateur :</strong> {{ $user_name }}</p>
        </div>
        <div class="qr-code">
            <p><strong>Code QR pour Vérification</strong></p>
            <img src="data:image/svg+xml;base64,{{ $qr_code_svg }}" alt="Code QR">
        </div>
    </div>
</body>
</html>
