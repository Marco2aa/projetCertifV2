<?php

namespace App\Controller;

use App\Entity\Stripe;
use App\Repository\StripeRepository;
use App\Repository\UserRepository;
use App\Service\OrderService;
use App\Service\WalletService;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Stripe\Checkout\Session;
use Stripe\CreditNote;
use Stripe\Exception\ApiErrorException;
use Stripe\Invoice;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;


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
                'metadata' => [
                    'deviseId' => $data['deviseId'],
                    'userName' => $data['email'],
                    'walletId' => $data['walletId']
                ],
                'mode' => 'payment',
                'success_url' => 'https://example.com/success',
                'cancel_url' => 'https://example.com/cancel',
            ]);




            return $this->json(['sessionId' => $session->id]);
        } catch (ApiErrorException $e) {
            return new JsonResponse(['error' => 'Error creating checkout session: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/webhook/payment', name: 'payment_succeeded', methods: ['POST'])]
    public function payementSucceeded(
        Request $request,
        EntityManagerInterface $em,
        OrderService $orderService,
        WalletService $walletService,
        UserRepository $userRepo,
        StripeRepository $stripeRepo,
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $eventType = $data['type'];

        try {
            $stripe = null;
            if ($eventType === 'charge.succeeded') {
                $stripe = new Stripe();
                $stripe->setAmount($data['data']['object']['amount'] / 100);
                $stripe->setIdStripe($data['data']['object']['payment_intent']);
                $stripe->setPaymentSuccess(true);
                $stripe->setReceiptUrl($data['data']['object']['receipt_url']);
                $em->persist($stripe);
                $em->flush();
            }
            if ($eventType === 'checkout.session.completed') {
                $metadata = $data['data']['object']['metadata'];
                $deviseId = $metadata['deviseId'];
                $walletId = $metadata['walletId'];
                $stripe = $stripeRepo->findOneBy(['id_stripe' => $data['data']['object']['payment_intent']]);
                $user = $userRepo->findOneBy(['email' => $metadata['userName']]);
                $amount = $data['data']['object']['amount_total'] / 100;
                $walletService->updateWalletSolde($user, $walletId, $amount);
                $orderService->createDepositOrder(
                    'depot',
                    $amount,
                    new \DateTimeImmutable(),
                    $walletId,
                    $deviseId,
                    $stripe
                );
            }
            return new JsonResponse(['message' => 'ok']);
        } catch (Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
        }

        return  new JsonResponse(['message' => 'ok']);
    }
}
