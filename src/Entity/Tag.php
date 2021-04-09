<?php

namespace App\Entity;

use App\Repository\TagRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=TagRepository::class)
 */
class Tag
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=10, nullable=true)
     */
    private $color;

    /**
     * @ORM\ManyToMany(targetEntity=Task::class, mappedBy="tags_id")
     */
    private $tasks_id;

    /**
     * @ORM\ManyToMany(targetEntity=User::class, inversedBy="tags")
     */
    private $user_id;

    public function __construct()
    {
        $this->tasks_id = new ArrayCollection();
        $this->user_id = new ArrayCollection();
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

    public function getColor(): ?string
    {
        return $this->color;
    }

    public function setColor(?string $color): self
    {
        $this->color = $color;

        return $this;
    }

    /**
     * @return Collection|Task[]
     */
    public function getTasksId(): Collection
    {
        return $this->tasks_id;
    }

    public function addTasksId(Task $tasksId): self
    {
        if (!$this->tasks_id->contains($tasksId)) {
            $this->tasks_id[] = $tasksId;
            $tasksId->addTagsId($this);
        }

        return $this;
    }

    public function removeTasksId(Task $tasksId): self
    {
        if ($this->tasks_id->removeElement($tasksId)) {
            $tasksId->removeTagsId($this);
        }

        return $this;
    }

    /**
     * @return Collection|User[]
     */
    public function getUserId(): Collection
    {
        return $this->user_id;
    }

    public function addUserId(User $userId): self
    {
        if (!$this->user_id->contains($userId)) {
            $this->user_id[] = $userId;
        }

        return $this;
    }

    public function removeUserId(User $userId): self
    {
        $this->user_id->removeElement($userId);

        return $this;
    }
}
