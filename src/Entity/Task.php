<?php

namespace App\Entity;

use App\Repository\TaskRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=TaskRepository::class)
 */
class Task
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $title;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $description;

    /**
     * @ORM\Column(type="boolean", options={"default": false})
     */
    private $finish;

    /**
     * @ORM\Column(type="datetime")
     */
    private $created_at;

    /**
     * @ORM\Column(type="integer", options={"default": 0})
     */
    private $position;

    /**
     * @ORM\ManyToMany(targetEntity=Tag::class, inversedBy="tasks_id")
     */
    private $tags_id;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="tasks")
     * @ORM\JoinColumn(name="user_id",nullable=false)
     */
    private $user_id;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $due_date;

    public function __construct()
    {
        $this->created_at = new \DateTime();
        $this->finish = false;
        $this->position = 0;
        $this->tags_id = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getFinish(): ?bool
    {
        return $this->finish;
    }

    public function setFinish(bool $finish): self
    {
        $this->finish = $finish;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeInterface $created_at): self
    {
        $this->created_at = $created_at;

        return $this;
    }

    public function getPosition(): ?int
    {
        return $this->position;
    }

    public function setPosition(int $position): self
    {
        $this->position = $position;

        return $this;
    }

    /**
     * @return Collection|Tag[]
     */
    public function getTagsId(): Collection
    {
        return $this->tags_id;
    }

    public function addTagsId(Tag $tagsId): self
    {
        if (!$this->tags_id->contains($tagsId)) {
            $this->tags_id[] = $tagsId;
        }

        return $this;
    }

    public function removeTagsId(Tag $tagsId): self
    {
        $this->tags_id->removeElement($tagsId);

        return $this;
    }

    public function getUserId(): ?User
    {
        return $this->user_id;
    }

    public function setUserId(?User $user_id): self
    {
        $this->user_id = $user_id;

        return $this;
    }

    public function getDueDate(): ?\DateTimeInterface
    {
        return $this->due_date;
    }

    public function setDueDate(?\DateTimeInterface $due_date): self
    {
        $this->due_date = $due_date;

        return $this;
    }
}
