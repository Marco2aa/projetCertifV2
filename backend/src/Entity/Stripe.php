<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\StripeRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: StripeRepository::class)]
#[ApiResource]
class Stripe
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?bool $payment_success = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $receipt_url = null;

    #[ORM\Column(nullable: true)]
    private ?float $amount = null;



    #[ORM\Column(length: 255, nullable: true)]
    private ?string $id_stripe = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function isPaymentSuccess(): ?bool
    {
        return $this->payment_success;
    }

    public function setPaymentSuccess(bool $payment_success): static
    {
        $this->payment_success = $payment_success;

        return $this;
    }

    public function getReceiptUrl(): ?string
    {
        return $this->receipt_url;
    }

    public function setReceiptUrl(?string $receipt_url): static
    {
        $this->receipt_url = $receipt_url;

        return $this;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount(?float $amount): static
    {
        $this->amount = $amount;

        return $this;
    }



    public function getIdStripe(): ?string
    {
        return $this->id_stripe;
    }

    public function setIdStripe(string $id_stripe): static
    {
        $this->id_stripe = $id_stripe;

        return $this;
    }
}
