document.addEventListener('DOMContentLoaded', () => {
    // Lista de descrições em ordem alfabética
    const descricoes = [
        'Água',
        'Assinaturas',
        'Carro',
        'Combustível',
        'Condomínio',
        'Delivery',
        'Energia',
        'Escola',
        'Internet',
        'Lanche',
        'Paula',
        'Supermercado',
        'Taxa Extra',
        'Telefone',
        'Vestuário'
    ];

    const selectDescricao = document.getElementById('descricao');
    const campoNovaDescricao = document.getElementById('campoNovaDescricao');
    const novaDescricao = document.getElementById('novaDescricao');
    const formDespesa = document.getElementById('formDespesa');
    const btnEditar = document.getElementById('btnEditar');
    const valorDespesaInput = document.getElementById('valorDespesa');
    const formaPagamentoSelect = document.getElementById('formaPagamento');
    const parcelaInput = document.getElementById('parcela');

    let ultimaDespesa = null;

    // Função para preencher a lista de descrições
    function preencherDescricoes() {
        selectDescricao.innerHTML = '<option value="" disabled selected>Selecione ou digite uma descrição</option>';
        
        descricoes.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            selectDescricao.appendChild(option);
        });

        const optionOutros = document.createElement('option');
        optionOutros.value = 'Outros';
        optionOutros.textContent = 'Outros (digite abaixo)';
        selectDescricao.appendChild(optionOutros);
    }

    preencherDescricoes();

    // Evento para desabilitar o campo Parcela para Pix, Débito e Boleto
    formaPagamentoSelect.addEventListener('change', () => {
        const formaPagamento = formaPagamentoSelect.value;
        const desabilitar = ['Pix', 'Cartão de Débito', 'Boleto'].includes(formaPagamento);
        
        if (desabilitar) {
            parcelaInput.value = '1';
            parcelaInput.disabled = true;
        } else {
            parcelaInput.value = '';
            parcelaInput.disabled = false;
        }
    });

    // Evento de formatação do valor
    valorDespesaInput.addEventListener('input', (e) => {
        let value = e.target.value;
        value = value.replace(/\D/g, ''); // Remove tudo que não for dígito
        
        if (value.length > 0) {
            value = parseInt(value, 10);
            value = (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        } else {
            value = '';
        }
        e.target.value = value;
    });

    // Evento de mudança no select de descrição
    selectDescricao.addEventListener('change', () => {
        if (selectDescricao.value === 'Outros') {
            campoNovaDescricao.style.display = 'block';
            novaDescricao.setAttribute('required', 'required');
        } else {
            campoNovaDescricao.style.display = 'none';
            novaDescricao.removeAttribute('required');
            novaDescricao.value = '';
        }
    });

    // Evento de submissão do formulário
    formDespesa.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o envio padrão

        let descricaoFinal = selectDescricao.value;
        if (descricaoFinal === 'Outros') {
            descricaoFinal = novaDescricao.value;
        }

        // Novo: Limpa o valor antes de enviar
        const valorNumerico = valorDespesaInput.value
            .replace('R$', '')
            .trim()
            .replace(/\./g, '')
            .replace(',', '.');
        
        // Cria um objeto FormData para enviar os dados
        const formData = new FormData();
        formData.append('data_despesa', document.getElementById('dataDespesa').value);
        formData.append('forma_pagamento', document.getElementById('formaPagamento').value);
        formData.append('parcela', parcelaInput.value);
        formData.append('valor', valorNumerico); // Envia o valor limpo
        formData.append('descricao', descricaoFinal);

        // Envia os dados para o script PHP usando fetch
        fetch('salvar_despesa.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            formDespesa.reset();
            campoNovaDescricao.style.display = 'none';
            novaDescricao.removeAttribute('required');
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Houve um erro ao registrar a despesa.');
        });
    });

    // Evento do botão de edição
    btnEditar.addEventListener('click', () => {
        if (ultimaDespesa) {
            document.getElementById('dataDespesa').value = ultimaDespesa.dataDespesa;
            document.getElementById('formaPagamento').value = ultimaDespesa.formaPagamento;
            parcelaInput.value = ultimaDespesa.parcela;
            valorDespesaInput.value = ultimaDespesa.valor;
            
            // Reabilita o campo Parcela antes de preencher
            parcelaInput.disabled = false;
            
            const isPredefined = descricoes.includes(ultimaDespesa.descricao);
            if (isPredefined) {
                selectDescricao.value = ultimaDespesa.descricao;
                campoNovaDescricao.style.display = 'none';
                novaDescricao.removeAttribute('required');
                novaDescricao.value = '';
            } else {
                selectDescricao.value = 'Outros';
                campoNovaDescricao.style.display = 'block';
                novaDescricao.setAttribute('required', 'required');
                novaDescricao.value = ultimaDespesa.descricao;
            }
        } else {
            alert('Nenhuma despesa para editar.');
        }
    });
});