<?php

namespace App\Controller;

use App\Entity\Stripe;
use App\Repository\CryptoRepository;
use App\Repository\DeviseRepository;
use App\Repository\ProduitStripeRepository;
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



        \Stripe\Stripe::setApiKey('sk_test_51Ovg9SK0rs45oKLry2Bm17nxBsh886BTtFXwPXjU91aiuuFs6M8osIjFEq5E4oCNdV42hZuufGzWsdsNfLdr0rL300eHmQCd2D');

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
                    $user->getId(),
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

    #[Route('/api/create-checkout-session/buy-and-sell', name: 'create_checkout_session_buy_and_sell', methods: ['POST'])]
    public function createBuyCheckoutSession(Request $request, ProduitStripeRepository $productRepository, CryptoRepository $cryptoRepo, DeviseRepository $deviseRepo): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        \Stripe\Stripe::setApiKey('sk_test_51Ovg9SK0rs45oKLry2Bm17nxBsh886BTtFXwPXjU91aiuuFs6M8osIjFEq5E4oCNdV42hZuufGzWsdsNfLdr0rL300eHmQCd2D');

        try {
            $cryptoId = $data['cryptoId'];
            // Trouver l'entité Crypto correspondante
            $crypto = $cryptoRepo->find($cryptoId);
            $devise = $deviseRepo->find($data['deviseId']);

            // Vérifier si la Crypto existe
            if (!$crypto) {
                throw new \Exception('Crypto not found');
            }
            // Accéder à la relation ProduitStripe depuis l'entité Crypto
            $produitStripe = $crypto->getProduitStripe();

            // Extraire l'identifiant du produit
            $productId = $produitStripe->getProduitId();
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'eur',
                        'unit_amount' => round(($data['amount'] / $devise->getValeur()) * 100),
                        'product' => $productId,

                    ],
                    'quantity' => 1,
                ]],
                'metadata' => [
                    'deviseId' => $data['deviseId'],
                    'userName' => $data['email'],
                    'walletId' => $data['walletId'],
                    'quantity' => $data['quantity'],
                    'eur_price' => ($data['amount'] / $devise->getValeur()) * 100,
                    'this_price' => $crypto->getCurrentPrice(),

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
}
