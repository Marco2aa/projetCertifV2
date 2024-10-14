<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

class APIAuthenticator extends AbstractAuthenticator
{


    public function supports(Request $request): ?bool
    {
        // Vérifie si l'en-tête Authorization contient un Bearer token
        return $request->headers->has('Authorization') && str_contains($request->headers->get('Authorization'), 'Bearer');
    }

    public function authenticate(Request $request): Passport
    {
        // Extraction du token JWT de l'en-tête Authorization
        $identifier = str_replace('Bearer ', '', $request->headers->get('Authorization'));

        // Utilisation de UserBadge pour identifier l'utilisateur à partir du token
        return new SelfValidatingPassport(
            new UserBadge($identifier)
        );
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        // Laisse l'application continuer normalement en cas de succès d'authentification
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        // Retourne un message d'erreur et un statut HTTP 401 en cas d'échec
        return new JsonResponse([
            'message' => $exception->getMessage()
        ], Response::HTTP_UNAUTHORIZED);
    }
}
