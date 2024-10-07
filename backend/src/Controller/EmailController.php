<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class EmailController extends AbstractController
{

    #[Route('/api/forgot-password', methods: ['POST'])]
    public function forgotPassword(Request $request, MailerInterface $mailer, EntityManagerInterface $em)
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;

        if (!$email) {
            return new JsonResponse(['error' => 'Email is required'], 400);
        }

        // Trouver l'utilisateur par son email
        $user = $em->getRepository(User::class)->findOneBy(['email' => $email]);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        $resetToken = bin2hex(random_bytes(32));

        $expirationDate = new \DateTime();
        $expirationDate->modify('+1 hour');

        $user->setPasswordResetToken($resetToken);
        $user->setPasswordResetTokenExpiresAt($expirationDate);

        $em->persist($user);
        $em->flush();

        $frontendUrl = 'http://localhost:3000/reset-password';
        $resetUrl = $frontendUrl . '/' . $resetToken;


        $resetEmail = (new Email())
            ->from('bouzamarcantoine@gmail.com')
            ->to($email)
            ->subject('Réinitialiser votre mot de passe')
            ->text('Cliquez sur ce lien pour réinitialiser votre mot de passe : ' . $resetUrl);

        $mailer->send($resetEmail);

        return new JsonResponse(['message' => 'E-mail de récupération envoyé']);
    }

    #[Route('/api/reset-password/{token}', methods: ['POST'], name: 'reset_password')]
    public function resetPassword($token, Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $passwordHasher)
    {
        $data = json_decode($request->getContent(), true);
        $newPassword = $data['newPassword'] ?? null;

        if (!$newPassword) {
            return new JsonResponse(['error' => 'New password is required'], 400);
        }

        $user = $em->getRepository(User::class)->findOneBy(['passwordResetToken' => $token]);

        if (!$user) {
            return new JsonResponse(['error' => 'Invalid token'], 404);
        }

        if (new \DateTime() > $user->getPasswordResetTokenExpiresAt()) {
            return new JsonResponse(['error' => 'Token has expired'], 400);
        }

        $hashedPassword = $passwordHasher->hashPassword($user, $newPassword);
        $user->setPassword($hashedPassword);

        $user->setPasswordResetToken(null);
        $user->setPasswordResetTokenExpiresAt(null);

        $em->persist($user);
        $em->flush();

        return new JsonResponse(['message' => 'Mot de passe réinitialisé avec succès']);
    }
}
