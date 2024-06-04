<script lang="ts">
  import { onMount } from 'svelte'

  let formData = {
    ankiHost: '',
    settingsShorts: '',
    menusShorts: ''
  }
  onMount(async () => {
    let res = await window.electron.ipcRenderer.invoke('settings:get', 'settings')
    if (res) {
      formData = res as typeof formData
    }
    if (!formData.ankiHost) {
      formData.ankiHost = import.meta.env.VITE_ANKI_DEFAULT_HOST
    }
  })
  async function handleSave() {
    await window.electron.ipcRenderer.invoke('settings:set', 'settings', formData)
    await window.electron.ipcRenderer.invoke('toggleMainWindow')
    alert('Saved!')
  }
</script>

<form on:submit|preventDefault={handleSave}>
  <label>
    <span>Anki Host</span>
    <input type="text" bind:value={formData.ankiHost} />
  </label>
  <label>
    <span>shorts for Settings</span>
    <input type="text" bind:value={formData.settingsShorts} />
  </label>
  <label>
    <span>shorts for Menus</span>
    <input type="text" bind:value={formData.menusShorts} />
  </label>
  <button>Save</button>
</form>

<style>
  label {
    display: block;
    padding: 0.5rem;
  }
  label span {
    display: inline-block;
    min-width: 10rem;
  }
  label span::after {
    content: ':';
  }
</style>
