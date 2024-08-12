
$(document).ready(function () {
    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CPF').val(obj.CPF);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        CarregarItems(obj.Beneficiarios);
    }

    function CarregarItems(beneficiarios) {
        for (let i = 0; i < beneficiarios.length; i++)
        {
            const CPFBeneficiario = beneficiarios[i].CPF;
            const NomeBeneficiario = beneficiarios[i].Nome;

            const tableBody = document.querySelector('#modalBeneficiarios tbody');
            const novaLinha = document.createElement('tr');

            const cpfCelula = document.createElement('td');
            cpfCelula.textContent = CPFBeneficiario;

            const nomeCelula = document.createElement('td');
            nomeCelula.textContent = NomeBeneficiario;

            const acaoCelula = document.createElement('td');
            acaoCelula.classList.add('action-buttons');

            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Alterar';
            btnEditar.classList.add('btn', 'btn-sm', 'btn-primary');
            btnEditar.onclick = () => EditarItem(novaLinha);
            acaoCelula.appendChild(btnEditar);

            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.style.marginLeft = '5px';
            btnExcluir.classList.add('btn', 'btn-sm', 'btn-primary');
            btnExcluir.onclick = () => ExcluirItem(novaLinha);
            acaoCelula.appendChild(btnExcluir);

            novaLinha.appendChild(cpfCelula);
            novaLinha.appendChild(nomeCelula);
            novaLinha.appendChild(acaoCelula);

            tableBody.appendChild(novaLinha);
        }
    }

    $('#formCadastro').submit(function (e) {
        function getBeneficiarios() {
            const beneficiarios = [];
            $('#tableBeneficiarios tbody tr').each(function () {
                const nome = $(this).find('td').eq(1).text();
                const cpf = $(this).find('td').eq(0).text();
                beneficiarios.push({
                    Nome: nome,
                    CPF: cpf
                });
            });
            return beneficiarios;
        }

        e.preventDefault();
        
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CPF": $(this).find("#CPF").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "Beneficiarios": getBeneficiarios()
            },
            error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
            function (r) {
                sessionStorage.setItem("successMessage", r);
                window.location.href = urlRetorno;
            }
        });
    })

    $('#btnBeneficiarios').click(function () {
        $('#modalBeneficiarios').modal();
    });
})

function AddItem() {
    if (!ValidarCPF(document.getElementById("CPFBeneficiario")))
    {
        ModalDialog("Atenção!", "CPF inválido. Favor inserir um CPF válido.");
    }
    else
    {
        const CPFBeneficiario = document.getElementById('CPFBeneficiario').value;
        const NomeBeneficiario = document.getElementById('NomeBeneficiario').value;

        var itens = GetItems(1);
        var resultado = false;

        itens.forEach(item => {
            console.log(item.CPF)
            if (item.CPF == CPFBeneficiario) {
                resultado = true;
            }
        });
        if (resultado) {
            ModalDialog('Atenção!', 'CPF já existente na lista do cliente');
            return;
        }

        if (CPFBeneficiario.trim() === '' || NomeBeneficiario.trim() === '') {
            ModalDialog('Atenção!', 'Por favor, preencha todos os campos');
            return;
        }

        const tableBody = document.querySelector('#modalBeneficiarios tbody');
        const novaLinha = document.createElement('tr');

        const cpfCelula = document.createElement('td');
        cpfCelula.textContent = CPFBeneficiario;

        const nomeCelula = document.createElement('td');
        nomeCelula.textContent = NomeBeneficiario;

        const acaoCelula = document.createElement('td');
        acaoCelula.classList.add('action-buttons');

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Alterar';
        btnEditar.classList.add('btn', 'btn-sm', 'btn-primary');
        btnEditar.onclick = () => EditarItem(novaLinha);
        acaoCelula.appendChild(btnEditar);

        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.style.marginLeft = '5px';
        btnExcluir.classList.add('btn', 'btn-sm', 'btn-primary');
        btnExcluir.onclick = () => ExcluirItem(novaLinha);
        acaoCelula.appendChild(btnExcluir);

        novaLinha.appendChild(cpfCelula);
        novaLinha.appendChild(nomeCelula);
        novaLinha.appendChild(acaoCelula);

        tableBody.appendChild(novaLinha);

        document.getElementById('itemForm').reset();
    }
}

function EditarItem(linha) {
    var CPFBeneficiario = document.getElementById('CPFBeneficiario').value;
    var NomeBeneficiario = document.getElementById('NomeBeneficiario').value;
    if (CPFBeneficiario.trim() === '' || NomeBeneficiario.trim() === '') {
        ModalDialog('Atenção!', 'Por favor, preencha todos os campos.');
        return;
    }
    if (!ValidarCPF(document.getElementById("CPFBeneficiario"))) {
        ModalDialog("Atenção!", "CPF inválido. Favor inserir um CPF válido.");
    }
    else {
        if (NomeBeneficiario !== null) linha.cells[1].innerHTML = NomeBeneficiario;
        if (CPFBeneficiario !== null) linha.cells[0].innerHTML = CPFBeneficiario;
    }
}

function ExcluirItem(linha) {
    linha.parentNode.removeChild(linha);
}

function GetItems(array = 0) {
    const rows = document.querySelectorAll('#modalBeneficiarios tbody tr');

    const items = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const item = {
            Nome: cells[1].textContent,
            CPF: cells[0].textContent
        };
        items.push(item);
    });

    if (array != 0) {
        return items;
    }

    const obj = { items };

    console.log(obj);

    return obj;
}

function MascaraCPF(input) {
    let cpf = input.value;
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length == 11) {
        if (!ValidarCPF(input)) {
            ModalDialog("Atenção!", "CPF inválido. Favor inserir um CPF válido.");
        }
    }
    if (cpf.length <= 11) {
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    input.value = cpf;
}

function ValidarCPF(elemento) {
    let cpf = elemento.value.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) {
        resto = 0;
    }

    if (resto !== parseInt(cpf.substring(9, 10))) {
        return false;
    }

    soma = 0;

    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) {
        resto = 0;
    }

    if (resto !== parseInt(cpf.substring(10, 11))) {
        return false;
    }

    return true;
}

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}
