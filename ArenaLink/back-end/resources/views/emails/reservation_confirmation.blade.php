<!DOCTYPE html>
<html>
<head>
    <title>Confirmation de Réservation</title>
</head>
<body>
    <h1>Réservation Confirmée !</h1>
    <p>Cher/Chère {{ $user_name }},</p>
    <p>Votre réservation a été confirmée avec les détails suivants :</p>

    <ul>
        <li>ID de Réservation : {{ $reservation_id }}</li>
        <li>Stade : {{ $stade_name }}</li>
        <li>Date et Heure de Début : {{ $start_time }}</li>
        <li>Durée : {{ $duration }} heures</li>
    </ul>

    <p>Vous trouverez en pièce jointe un QR code. Veuillez le présenter à l'entrée du stade pour valider votre réservation.</p>

    <p>Merci pour votre réservation !</p>
</body>
</html>
