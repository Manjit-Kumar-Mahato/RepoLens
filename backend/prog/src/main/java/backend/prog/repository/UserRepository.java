package backend.prog.repository;

import backend.prog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByGitId(Long gitId);

    Optional<User> findByGitUsername(String gitUsername);
}