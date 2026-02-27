package com.financeiro.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.financeiro.dto.MetaDTO;
import com.financeiro.entities.Conta;
import com.financeiro.entities.Meta;
import com.financeiro.repository.ContaRepository;
import com.financeiro.repository.DepositoRepository;
import com.financeiro.repository.MetaRepository;
import com.financeiro.util.ContaMapper;
import com.financeiro.util.MetaMapper;

@Service
public class MetaService {

    @Autowired
    private MetaRepository metaRepository;

    @Autowired 
    private ContaRepository contaRepository;

    @Autowired
    private DepositoRepository depositoRepository;

    public ResponseEntity<MetaDTO> adicionarMeta(MetaDTO metaDTO) {

        Conta conta = contaRepository.findById(metaDTO.getContaDTO().getId()).orElseThrow(() -> new RuntimeException("Conta não encontrada"));
        metaDTO.setContaDTO(ContaMapper.paraDTO(conta));
        Meta meta = MetaMapper.paraEntity(metaDTO);
        Meta metaSalva = new Meta();

        try {
            metaSalva = metaRepository.save(meta);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        metaDTO.setId(metaSalva.getId());

        return ResponseEntity.ok(metaDTO);
    }

    public ResponseEntity<MetaDTO> buscarMetaPorId(Long id) {

        Optional<MetaDTO> metaDTO = MetaMapper.paraDtoOptional(metaRepository.findById(id));

        return metaDTO.map(meta -> ResponseEntity.ok(meta)).orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<List<MetaDTO>> listarMetasPorConta(Long idConta) {

        List<Meta> metas = metaRepository.findByContaId(idConta);
        List<MetaDTO> metasDTO = metas.stream().map(meta -> MetaMapper.paraDTO(meta)).collect(Collectors.toList());

        return ResponseEntity.ok(metasDTO);
    }

    public ResponseEntity<MetaDTO> alterarMeta(Long id, MetaDTO metaDTO) {
        MetaDTO metaAlterada = metaRepository.findById(id).map(meta -> {
            Conta conta = contaRepository.findById(metaDTO.getContaDTO().getId()).orElseThrow(() -> new RuntimeException("Conta não encontrada"));
            meta.setObjetivo(metaDTO.getObjetivo());
            meta.setValor(metaDTO.getValor());
            meta.setDataInicio(metaDTO.getDataInicio());
            meta.setDataFim(metaDTO.getDataFim());
            meta.setConta(conta);
            metaRepository.save(meta);
            return MetaMapper.paraDTO(meta);
        }).orElseThrow(() -> new RuntimeException("Meta não encontrada"));

        return ResponseEntity.ok(metaAlterada);
    }

    public ResponseEntity<Void> deletarMeta(Long id) {

        Optional<Meta> meta = metaRepository.findById(id);

        if (meta.isPresent()) {
            depositoRepository.deleteByMeta(id);
            metaRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
}
