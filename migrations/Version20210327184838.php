<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210327184838 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE tag_user (tag_id INT NOT NULL, user_id INT NOT NULL, PRIMARY KEY(tag_id, user_id))');
        $this->addSql('CREATE INDEX IDX_639C69FFBAD26311 ON tag_user (tag_id)');
        $this->addSql('CREATE INDEX IDX_639C69FFA76ED395 ON tag_user (user_id)');
        $this->addSql('ALTER TABLE tag_user ADD CONSTRAINT FK_639C69FFBAD26311 FOREIGN KEY (tag_id) REFERENCES tag (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tag_user ADD CONSTRAINT FK_639C69FFA76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP TABLE tag_user');
    }
}
