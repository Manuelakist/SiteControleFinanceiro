package com.financeiro.repository;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.financeiro.entities.Receita;

@Repository
public interface ReceitaRepository extends JpaRepository<Receita, Long> {

    List<Receita> findByContaIdAndDataBetween(Long idConta, Date dataInicial, Date dataFinal);

    List<Receita> findByCategoriaReceitaIdAndDataBetween(Long idCategoria, Date dataInicial, Date dataFinal);
    
    List<Receita> findByContaIdAndDescricao(Long idConta, String descricao);

    @Query("SELECT SUM(r.valor) FROM Receita r WHERE r.conta.id = :idConta AND r.data BETWEEN :dataInicial AND :dataFinal")
    BigDecimal somarReceitas(@Param("idConta") Long idConta, 
                             @Param("dataInicial") Date dataInicial, 
                             @Param("dataFinal") Date dataFinal);

    @Query("SELECT SUM(r.valor) FROM Receita r WHERE r.conta.id = :idConta AND r.categoriaReceita.id = :idCategoria AND r.data BETWEEN :dataInicial AND :dataFinal")
    BigDecimal somarReceitasPorCategoria(@Param("idConta") Long idConta, 
                                                       @Param("idCategoria") Long idCategoria, 
                                                       @Param("dataInicial") Date dataInicial, 
                                                       @Param("dataFinal") Date dataFinal);
    
}