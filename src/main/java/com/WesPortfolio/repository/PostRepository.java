package com.WesPortfolio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.WesPortfolio.domain.Post;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByPublishedTrueOrderByDateDescIdDesc();

    Optional<Post> findBySlug(String slug);

    Optional<Post> findBySlugAndPublishedTrue(String slug);
}
