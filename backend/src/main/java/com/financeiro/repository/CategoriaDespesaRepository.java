package com.financeiro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.financeiro.entities.CategoriaDespesa;

@Repository
public interface CategoriaDespesaRepository extends JpaRepository<CategoriaDespesa, Long> {

    List<CategoriaDespesa> findByContaId(Long idConta);
    
}
