<?php

namespace App\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
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
}
