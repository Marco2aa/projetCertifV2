<?php

namespace App\Controller;

use App\Service\WalletService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class WalletController extends AbstractController
{

    #[Route('/api/walletuser')]
    #[IsGranted('ROLE_USER')]
    public function getWalletByUser()
    {

        return $this->json($this->getUser()->getWallets());
    }


    #[Route('/api/walletupdate/{walletName}', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function updateWallet(
        string $walletName,
        Request $request,
        WalletService $walletService
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        if (!isset($data['solde'])) {
            return $this->json(['error' => 'Solde non fourni dans les données'], 400);
        }

        $newSolde = $data['solde'];
        $user = $this->getUser();

        try {
            $walletService->updateWalletSolde($user, $walletName, $newSolde);
            return $this->json(['message' => 'Solde mis à jour avec succès', 'new_solde' => $newSolde]);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['error' => $e->getMessage()], 404);
        }
    }
}
