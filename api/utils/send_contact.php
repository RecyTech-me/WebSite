<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupération des données
    $contenu = htmlspecialchars($_POST['contenu'] ?? '');
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);

    // Envoi de l'email
    if ($email && !empty($contenu)) {
        $to = "douxx@douxx.xyz";
        $subject = "Contact from $email";
        $message = "
        <html>
        <head>
          <title>$subject</title>
        </head>
        <body style='font-family: Arial, sans-serif; background-color: #E8DFCA; padding: 20px; color: #4F6F52;'>
          <div style='background-color: #ffffff; border-radius: 25px; padding: 20px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);'>
            <div style='display: flex; align-items: center;'>
              <img src='https://cdn.douxx.xyz/files/RecyTech.png' alt='Logo' style='width: 100px; height: auto; margin-right: 20px;'>
              <h2 style='color: #4F6F52;'>Contact de $email</h2>
            </div>
            <p style='font-size: 16px; line-height: 1.6; color: #4F6F52;'>$contenu</p>
            <a href='mailto:$email' style='display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #4F6F52; color: white; text-decoration: none; border-radius: 25px; font-size: 16px;'>Répondre</a>
          </div>
        </body>
        </html>
        ";
        
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: <$email>" . "\r\n";

        // true/false
        if (mail($to, $subject, $message, $headers)) {
            //Envoi reussi
            echo "true";
        } else {
            // Envoi foiré
            echo "false";
        }
    } else {
        // Email invalide
        echo "false";
    }
} else {
    // Mauvaise requête
    echo "false";
}
?>
