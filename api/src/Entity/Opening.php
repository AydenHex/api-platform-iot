<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiFilter;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * This is an opening which could impact the room temperature. Usually, the opening leads outside.
 * @ApiResource()
 * @ORM\Entity(repositoryClass="App\Repository\OpeningRepository")
 * @ApiFilter(SearchFilter::class, properties={"adress64": "exact"})
 * @UniqueEntity("adress64")
 */
class Opening
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * The name of the opening.
     * @ORM\Column(type="string", length=30)
     */
    private $name;

    /**
     * The adress64 of the XBee associated with the opening.
     * @ORM\Column(type="string", length=255)
     */
    private $adress64;

    /**
     * @ORM\Column(type="boolean")
     */
    private $opened;

    public function __construct()
    {
        $this->heaters = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getAdress64(): ?string
    {
        return $this->adress64;
    }

    public function setAdress64(string $adress64): self
    {
        $this->adress64 = $adress64;

        return $this;
    }

    public function getOpened(): ?bool
    {
        return $this->opened;
    }

    public function setOpened(bool $opened): self
    {
        $this->opened = $opened;

        return $this;
    }
}
