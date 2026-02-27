package com.financeiro.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.financeiro.entities.Deposito;

import jakarta.transaction.Transactional;

@Repository
public interface DepositoRepository extends JpaRepository<Deposito, Long> {

    List<Deposito> findByMetaId(Long idMeta);

    @Query("SELECT SUM(d.valor) FROM Deposito d WHERE d.meta.id = :idMeta")
    BigDecimal somarDepositos(@Param("idMeta") Long idMeta);


    @Transactional
    @Modifying
    @Query("DELETE FROM Deposito d WHERE d.meta.id = :idMeta")
    void deleteByMeta(Long idMeta);

}
