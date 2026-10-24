package com.WesPortfolio.repository;

import java.time.Instant;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.WesPortfolio.domain.StoredFile;

public interface StoredFileRepository extends JpaRepository<StoredFile, String> {

    /** File details without loading the bytes. */
    interface Info {
        String getKey();

        String getFilename();

        String getContentType();

        long getSize();

        Instant getUpdatedAt();
    }

    @Query("select f.key as key, f.filename as filename, f.contentType as contentType, f.size as size, f.updatedAt as updatedAt "
            + "from StoredFile f where f.key = :key")
    Optional<Info> findInfo(@Param("key") String key);
}
