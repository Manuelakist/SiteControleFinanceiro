package com.financeiro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.financeiro.entities.Conta;

@Repository
public interface ContaRepository extends JpaRepository<Conta, Long> {
    
    List<Conta> findByUsuarioId(Long idUsuario);

}
