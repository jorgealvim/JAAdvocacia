import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBIYdJx9xuf1yXlfKbK73_XoirLRaQGaXo",
  authDomain: "jorgealvimadvocacia-23ce5.firebaseapp.com",
  projectId: "jorgealvimadvocacia-23ce5",
  storageBucket: "jorgealvimadvocacia-23ce5.firebasestorage.app",
  messagingSenderId: "839395120060",
  appId: "1:839395120060:web:493684582ae2c0da7811b9"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById('btnMaster').addEventListener('click', function() {
    const box = document.getElementById('masterBox');
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
});

// Salvar Master
const masterForm = document.getElementById('masterForm');
if (masterForm) {
    masterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const master = {};
        formData.forEach((value, key) => master[key] = value);
        // Verificar duplicidade
        let duplicado = false;
        try {
            const querySnapshot = await getDocs(collection(db, "masters"));
            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                if (data.email === master.email || data.nome === master.nome) {
                    duplicado = true;
                }
            });
            let msg = document.getElementById('msgMaster');
            if (!msg) {
                msg = document.createElement('div');
                msg.id = 'msgMaster';
                msg.style.background = '#e3f2fd';
                msg.style.color = '#1976d2';
                msg.style.padding = '8px';
                msg.style.margin = '12px 0';
                msg.style.borderRadius = '4px';
                this.parentNode.insertBefore(msg, this);
            }
            if (duplicado) {
                msg.innerHTML = 'Master já tem cadastro! Deseja recuperar a senha? <button id="recuperarSenhaBtn" style="margin-left:8px;background:#1976d2;color:#fff;border:none;padding:4px 8px;border-radius:4px;">Sim</button>';
                document.getElementById('recuperarSenhaBtn').onclick = function() {
                    window.location.href = 'index.html#esqueci-senha';
                };
                return;
            }
            await addDoc(collection(db, "masters"), master);
            msg.textContent = 'Master cadastrado com sucesso!';
            this.reset();
            listarMasters();
        } catch (err) {
            alert("Erro ao salvar: " + err.message);
            console.error("Erro ao salvar master:", err);
        }
    });
}

// Buscar Masters
const buscarMasterBtn = document.getElementById('buscarMaster');
if (buscarMasterBtn) buscarMasterBtn.addEventListener('click', listarMasters);

async function listarMasters() {
    const lista = document.getElementById('listaMasters');
    if (!lista) return;
    lista.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "masters"));
    querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        lista.innerHTML += `<div style='border-bottom:1px solid #ccc;padding:8px;'>
            <strong>${data.nome}</strong> | ${data.email} | Nível: ${data.nivel}
            <button onclick='editarMaster("${docSnap.id}")' style='margin-left:8px;background:#1976d2;color:#fff;border:none;padding:4px 8px;border-radius:4px;'>Editar</button>
            <button onclick='excluirMaster("${docSnap.id}")' style='margin-left:8px;background:#d32f2f;color:#fff;border:none;padding:4px 8px;border-radius:4px;'>Excluir</button>
        </div>`;
    });
}

// Editar Master
window.editarMaster = async function(id) {
    try {
        const docRef = doc(db, "masters", id);
        const querySnapshot = await getDocs(collection(db, "masters"));
        let data;
        querySnapshot.forEach((d) => { if (d.id === id) data = d.data(); });
        if (!data) {
            alert("Master não encontrado.");
            return;
        }
        const form = document.getElementById('masterForm');
        form.nome.value = data.nome;
        form.email.value = data.email;
        form.senha.value = data.senha;
        form.nivel.value = data.nivel;
        form.setAttribute('data-edit-id', id);
    } catch (err) {
        alert("Erro ao buscar master: " + err.message);
        console.error("Erro ao buscar master:", err);
    }
}

// Salvar edição
if (masterForm) {
    masterForm.addEventListener('submit', async function(e) {
        if (this.hasAttribute('data-edit-id')) {
            e.preventDefault();
            const id = this.getAttribute('data-edit-id');
            const docRef = doc(db, "masters", id);
            const formData = new FormData(this);
            const master = {};
            formData.forEach((value, key) => master[key] = value);
            try {
                await updateDoc(docRef, master);
                alert("Master editado com sucesso!");
                this.reset();
                this.removeAttribute('data-edit-id');
                listarMasters();
            } catch (err) {
                alert("Erro ao editar: " + err.message);
                console.error("Erro ao editar master:", err);
            }
            return;
        }
    });
}

// Excluir Master
window.excluirMaster = async function(id) {
    if (!confirm("Deseja realmente excluir este master?")) return;
    try {
        await deleteDoc(doc(db, "masters", id));
        alert("Master excluído.");
        listarMasters();
    } catch (err) {
        alert("Erro ao excluir: " + err.message);
        console.error("Erro ao excluir master:", err);
    }
}
