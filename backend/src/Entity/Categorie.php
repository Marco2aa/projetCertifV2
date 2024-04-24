<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\CategorieRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CategorieRepository::class)]
#[ApiResource]
class Categorie
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable:true)]
    private ?string $identifiant = null;

    #[ORM\Column(length: 255,nullable:true)]
    private ?string $name = null;

    #[ORM\Column(nullable: true)]
    private ?float $market_cap = null;

    #[ORM\Column(nullable: true)]
    private ?float $market_cap_change_24h = null;

    #[ORM\Column(nullable: true)]
    private ?float $volume_24h = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $updated_at = null;

    #[ORM\Column(type: Types::ARRAY,nullable:true)]
    private array $top_3_coins = [];

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdentifiant(): ?string
    {
        return $this->identifiant;
    }

    public function setIdentifiant(string $identifiant): static
    {
        $this->identifiant = $identifiant;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getMarketCap(): ?float
    {
        return $this->market_cap;
    }

    public function setMarketCap(float $market_cap): static
    {
        $this->market_cap = $market_cap;

        return $this;
    }

    public function getMarketCapChange24h(): ?float
    {
        return $this->market_cap_change_24h;
    }

    public function setMarketCapChange24h(float $market_cap_change_24h): static
    {
        $this->market_cap_change_24h = $market_cap_change_24h;

        return $this;
    }


    

    



    public function getVolume24h(): ?float
    {
        return $this->volume_24h;
    }

    public function setVolume24h(float $volume_24h): static
    {
        $this->volume_24h = $volume_24h;

        return $this;
    }

    public function getUpdatedAt(): ?string
    {
        return $this->updated_at;
    }

    public function setUpdatedAt(string $updated_at): static
    {
        $this->updated_at = $updated_at;

        return $this;
    }

    public function getTop3Coins(): array
    {
        return $this->top_3_coins;
    }

    public function setTop3Coins(array $top_3_coins): static
    {
        $this->top_3_coins = $top_3_coins;

        return $this;
    }
}
