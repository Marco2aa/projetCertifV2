<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;



class SecurityController extends AbstractController
{
    #[Route(path: '/api/login', name: 'app_login', methods: ['POST'])]
    public function login(): JsonResponse
    {
        // Gérer l'authentification ici, par exemple :
        // $user = // Votre logique d'authentification

        // Si l'authentification réussit, vous pouvez retourner une réponse JSON avec un jeton JWT par exemple
        // Si l'authentification échoue, retournez une réponse JSON avec un code d'erreur approprié

        return new JsonResponse(['message' => 'Authentication successful'], Response::HTTP_OK);
    }

    #[Route(path: '/api/logout', name: 'app_logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        // Gérer la déconnexion ici, par exemple :
        // $user = $this->getUser();
        // Faire ce que vous devez faire pour déconnecter l'utilisateur

        return new JsonResponse(['message' => 'Logout successful'], Response::HTTP_OK);
    }
}
