package com.financeiro.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.financeiro.dto.DepositoDTO;
import com.financeiro.entities.Deposito;
import com.financeiro.entities.Meta;
import com.financeiro.repository.DepositoRepository;
import com.financeiro.repository.MetaRepository;
import com.financeiro.util.DepositoMapper;
import com.financeiro.util.MetaMapper;

@Service
public class DepositoService {

    @Autowired
    private DepositoRepository depositoRepository;

    @Autowired
    private MetaRepository metaRepository;

    public ResponseEntity<DepositoDTO> adicionarDeposito(DepositoDTO depositoDTO) {

        Meta meta = metaRepository.findById(depositoDTO.getMetaDTO().getId()).orElseThrow(() -> new RuntimeException("Meta não encontrada"));
        depositoDTO.setMetaDTO(MetaMapper.paraDTO(meta));
        Deposito deposito = DepositoMapper.paraEntity(depositoDTO);
        Deposito depositoSalvo = new Deposito();

        try {
            depositoSalvo = depositoRepository.save(deposito);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        depositoDTO.setId(depositoSalvo.getId());

        return ResponseEntity.ok(depositoDTO);
    }

    public ResponseEntity<List<DepositoDTO>> listarDepositosPorConta(Long idMeta) {

        List<Deposito> depositos = depositoRepository.findByMetaId(idMeta);
        List<DepositoDTO> depositosDTO = depositos.stream().map(deposito -> DepositoMapper.paraDTO(deposito)).collect(Collectors.toList());

        return ResponseEntity.ok(depositosDTO);
    }

    public ResponseEntity<BigDecimal> somarDepositos(Long idMeta) {
        BigDecimal valor = depositoRepository.somarDepositos(idMeta);

        return ResponseEntity.ok(valor);
    } 

    public ResponseEntity<Void> deletarDeposito(Long id) {

        Optional<Deposito> deposito = depositoRepository.findById(id);

        if (deposito.isPresent()) {
            depositoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
}
