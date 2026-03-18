document.addEventListener('DOMContentLoaded', function() {
    const formContainer = document.querySelector('section');
    // Verifica se há id na URL
    const urlParams = new URLSearchParams(window.location.search);
    const cadastroId = urlParams.get('id');
    let cadastros = localStorage.getItem('cadastroGeral');
    cadastros = cadastros ? JSON.parse(cadastros) : [];
    if (cadastroId) {
        // Exibe dados do cadastro
        const cadastro = cadastros.find(c => c.id === cadastroId);
        if (!cadastro) {
            formContainer.innerHTML = '<div style="color:red;">Cadastro não encontrado.</div>';
            return;
        }
        let camposHtml = '';
        Object.keys(cadastro).forEach(key => {
            if (key === 'id') return;
            camposHtml += `<div style='margin-bottom:8px;'><strong>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> <span id="${key}">${cadastro[key] || '-'}</span></div>`;
        });
        formContainer.innerHTML = `
            <h2>Dados do Cadastro</h2>
            <div class="cadastro-box" style="max-width:600px;">
                ${camposHtml}
                <div><strong>ID:</strong> <span id="id">${cadastro.id}</span></div>
                <button id="editarCadastro" class="btn-primary" style="margin:12px 8px 0 0;">Editar</button>
                <button id="salvarCadastro" class="btn-primary" style="margin:12px 8px 0 0; display:none;">Salvar</button>
                <button id="excluirCadastro" class="btn-google" style="margin:12px 0 0 0; background:#d32f2f;">Excluir</button>
            </div>
        `;
        // Editar
        document.getElementById('editarCadastro').onclick = function() {
            Object.keys(cadastro).forEach(key => {
                if (key === 'id') return;
                const span = document.getElementById(key);
                if (span) {
                    let tipo = 'text';
                    if (key === 'email') tipo = 'email';
                    if (key === 'dataNascimento') tipo = 'date';
                    span.innerHTML = `<input type='${tipo}' value='${cadastro[key] || ''}' id='edit_${key}' style='width:90%;'>`;
                }
            });
            document.getElementById('salvarCadastro').style.display = 'inline-block';
            this.style.display = 'none';
        };
        // Salvar
        document.getElementById('salvarCadastro').onclick = function() {
            Object.keys(cadastro).forEach(key => {
                if (key === 'id') return;
                const input = document.getElementById('edit_' + key);
                if (input) cadastro[key] = input.value;
            });
            localStorage.setItem('cadastroGeral', JSON.stringify(cadastros));
            alert('Cadastro atualizado!');
            window.location.reload();
        };
        // Excluir
        document.getElementById('excluirCadastro').onclick = function() {
            if (confirm('Deseja realmente excluir este cadastro?')) {
                const idx = cadastros.findIndex(c => c.id === cadastroId);
                if (idx > -1) {
                    cadastros.splice(idx, 1);
                    localStorage.setItem('cadastroGeral', JSON.stringify(cadastros));
                    alert('Cadastro excluído!');
                    window.location.href = 'admin.html';
                }
            }
        };
        return;
    }
    // ...existing code...
    formContainer.innerHTML = `
        <h2>Cadastre-se</h2>
        <div id="cadastro-box">
            <label for="tipoPessoa">Tipo de Pessoa:</label>
            <select id="tipoPessoa">
                <option value="fisica">Pessoa Física</option>
                <option value="juridica">Pessoa Jurídica</option>
            </select>
            <div id="formPessoa"></div>
        </div>
    `;
    // ...existing code...
    const tipoPessoa = document.getElementById('tipoPessoa');
    const formPessoa = document.getElementById('formPessoa');
    function renderForm(tipo) {
        // ...existing code...
    }
    tipoPessoa.addEventListener('change', function() {
        renderForm(this.value);
    });
    renderForm(tipoPessoa.value);
    function bindFormSubmit(tipo) {
        // ...existing code...
    }
});