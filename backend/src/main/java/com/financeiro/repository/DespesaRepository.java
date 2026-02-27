package com.financeiro.repository;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.financeiro.entities.Despesa;

@Repository
public interface DespesaRepository extends JpaRepository<Despesa, Long> {

    @Query("SELECT d FROM Despesa d WHERE d.conta.id = :idConta AND d.data BETWEEN :dataInicial AND :dataFinal ORDER BY d.data DESC")
    List<Despesa> findByContaIdAndDataBetween(Long idConta, Date dataInicial, Date dataFinal);

    List<Despesa> findByCategoriaDespesaIdAndDataBetween(Long idCategoria, Date dataInicial, Date dataFinal);

    List<Despesa> findByContaIdAndDescricao(Long idConta, String descricao);

    @Query("SELECT SUM(d.valor) FROM Despesa d WHERE d.conta.id = :idConta AND d.data BETWEEN :dataInicial AND :dataFinal")
    BigDecimal somarDespesas(@Param("idConta") Long idConta,
            @Param("dataInicial") Date dataInicial,
            @Param("dataFinal") Date dataFinal);

    @Query("SELECT SUM(d.valor) FROM Despesa d WHERE d.categoriaDespesa.id = :idCategoria AND d.data BETWEEN :dataInicial AND :dataFinal")
    BigDecimal somarDespesasPorCategoria(@Param("idCategoria") Long idCategoria,
            @Param("dataInicial") Date dataInicial,
            @Param("dataFinal") Date dataFinal);
}
