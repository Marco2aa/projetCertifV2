<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ProduitStripeRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProduitStripeRepository::class)]
#[ApiResource]
class ProduitStripe
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $ProduitId = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $name = null;

    #[ORM\OneToOne(inversedBy: 'produitStripe', cascade: ['persist', 'remove'])]
    private ?Crypto $crypto = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getProduitId(): ?string
    {
        return $this->ProduitId;
    }

    public function setProduitId(?string $ProduitId): static
    {
        $this->ProduitId = $ProduitId;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getCrypto(): ?Crypto
    {
        return $this->crypto;
    }

    public function setCrypto(?Crypto $crypto): static
    {
        $this->crypto = $crypto;

        return $this;
    }
}
