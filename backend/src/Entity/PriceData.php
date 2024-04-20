<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\PriceDataRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PriceDataRepository::class)]
#[ApiResource]
class PriceData
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $timestamp = null;

    #[ORM\Column]
    private ?float $price = null;

    #[ORM\Column(length: 255)]
    private ?string $granularity = null;

    #[ORM\ManyToOne(inversedBy: 'priceData')]
    private ?Crypto $crypto = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTimestamp(): ?\DateTimeInterface
    {
        return $this->timestamp;
    }

    public function setTimestamp(\DateTimeInterface $timestamp): static
    {
        $this->timestamp = $timestamp;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getGranularity(): ?string
    {
        return $this->granularity;
    }

    public function setGranularity(string $granularity): static
    {
        $this->granularity = $granularity;

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
