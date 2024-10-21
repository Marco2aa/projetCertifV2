<?php

namespace App\Controller;

use App\Entity\Order;
use App\Entity\User;
use App\Service\CryptoService;
use App\Service\OrderService;
use App\Service\WalletService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class WalletController extends AbstractController
{

    private $cryptoService;

    public function __construct(CryptoService $cryptoService)
    {
        $this->cryptoService = $cryptoService;
    }

    #[Route('/api/walletuser')]
    #[IsGranted('ROLE_USER')]
    public function getWalletByUser()
    {
        /** @var User $user */
        return $this->json($this->getUser()->getWallets());
    }


    #[Route('/api/walletupdate/{id}', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function updateWallet(
        string $id,
        Request $request,
        WalletService $walletService,
        OrderService $orderService
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        if (!isset($data['solde'])) {
            return $this->json(['error' => 'Solde non fourni dans les données'], 400);
        }
        $id = (int) $id;
        $newSolde = $data['solde'];
        $user = $this->getUser();



        try {
            $walletService->updateWalletSolde($user, $id, $newSolde);


            $orderService->createDepositOrder(
                $data['type'],
                $data['quantity'],
                new \DateTimeImmutable(),
                $id,
                $data['deviseId']


            );
            return $this->json(['message' => 'Solde mis à jour avec succès', 'new_solde' => $newSolde]);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['error' => $e->getMessage()], 404);
        }
    }


    #[Route('/api/user-cryptos', methods: ['GET'])]
    public function getUserCryptos(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        // Récupérer l'ID du wallet (tu peux passer cet ID en paramètre de requête GET si nécessaire)
        $walletId = (int)$_GET['walletId'];

        // Récupérer les cryptos possédées par l'utilisateur
        $cryptos = $this->cryptoService->getUserCryptosInWallet($user, $walletId);

        return new JsonResponse($cryptos);
    }
}
