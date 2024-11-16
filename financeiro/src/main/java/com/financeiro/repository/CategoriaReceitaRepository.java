package com.financeiro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.financeiro.entities.CategoriaReceita;

@Repository
public interface CategoriaReceitaRepository extends JpaRepository<CategoriaReceita, Long> {

    List<CategoriaReceita> findByContaId(Long idConta);
    
}
