<?php

namespace App\Controller;

use Stripe\Checkout\Session;
use Stripe\Exception\ApiErrorException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route as AttributeRoute;

class PaymentController extends AbstractController
{
    #[Route('/api/create-checkout-session', name: 'create_checkout_session', methods: ['POST'])]
    public function createCheckoutSession(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $amount = $data['montantEuros'];



        \Stripe\Stripe::setApiKey('sk_test_51PCKdwJY5Z1qjO57uVjIzHduLdHEMHSg6M6juDc7aDBoOypPJAmnfkWzjmmtwa9JNN94LPVACDwX8yzD90hcJZe700jZYfc6qu');

        try {

            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'eur',
                        'unit_amount' => $amount * 100,
                        'product_data' => [
                            'name' => 'Dépôt sur compte',
                        ],
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => 'https://example.com/success',
                'cancel_url' => 'https://example.com/cancel',
            ]);

            // Renvoyer l'ID de la session de paiement
            return $this->json(['sessionId' => $session->id]);
        } catch (ApiErrorException $e) {
            // Gérer les erreurs
            return new Response('Error creating checkout session: ' . $e->getMessage(), 500);
        }
    }
}
