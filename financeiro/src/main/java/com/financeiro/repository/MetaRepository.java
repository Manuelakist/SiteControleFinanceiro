package com.financeiro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.financeiro.entities.Meta;

@Repository
public interface MetaRepository extends JpaRepository<Meta, Long> {

    List<Meta> findByContaId(Long idConta);
    
}
