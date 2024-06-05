<script lang="ts">
  import { onMount } from 'svelte'
  import type { Menu } from '../../../types'
  import Editor from './menus/editor.svelte'
  import { without } from 'lodash'

  const keys: string[] = []
  // 1-9
  for (let i = 1; i <= 9; i++) {
    keys.push(i + '')
  }
  keys.push('0')
  // a-z
  for (let i = 97; i <= 122; i++) {
    keys.push(String.fromCharCode(i))
  }

  const isStandalong = window.location.hash.slice(1) === 'menus'
  function execMenu(menu) {
    window.electron.ipcRenderer.send('execMenu', menu)
  }
  let menus: Menu[] = []
  onMount(async () => {
    let res = await window.electron.ipcRenderer.invoke('settings:get', 'menus')
    if (Array.isArray(res)) {
      menus = res
    }
  })
  let editIndex = -1
  function updateMenu(e) {
    menus[editIndex] = e.detail
    editIndex = -1
    saveMenus()
  }

  function saveMenus() {
    window.electron.ipcRenderer.invoke('settings:set', 'menus', menus)
  }
  function addMenu() {
    menus = [...menus, { name: `newMenu-${Date.now()}`, code: '' }]
    saveMenus()
  }
  function delMenu(menu: Menu) {
    menus = without(menus, menu)
    saveMenus()
  }
  function moveMenu(index: number, offset: number) {
    const temp = menus[index]
    menus[index] = menus[index + offset]
    menus[index + offset] = temp
    saveMenus()
  }

  function handleKeyup(event: KeyboardEvent & { currentTarget: EventTarget & Window }) {
    if (!isStandalong) {
      return
    }
    if (event.key === 'Escape') {
      window.close()
      return
    }
    const i = keys.findIndex((k) => k === event.key)
    const menu = menus[i]
    if (menu) {
      execMenu(menu)
    }
  }
</script>

<svelte:window on:keyup={handleKeyup} />
{#if !isStandalong}
  <div>
    <button on:click={addMenu}>Add Menu</button>
  </div>
{/if}
<ul>
  {#each menus as menu, index}
    <li>
      <span class="menu-key">{keys[index]}</span>
      <a href="1" on:click|preventDefault={() => execMenu(menu)}>{menu.name}</a>
      {#if !isStandalong}
        <span>
          <button on:click={() => (editIndex = index)}>Edit</button>
          <button on:click={() => delMenu(menu)}>Delete</button>
          <button on:click={() => moveMenu(index, -1)} disabled={index === 0}>Up</button>
          <button on:click={() => moveMenu(index, 1)} disabled={index === menus.length - 1}
            >Down</button
          >
        </span>
      {/if}
    </li>
  {:else}
    <h1>No found any menus</h1>
  {/each}
</ul>
{#if editIndex >= 0}
  <Editor on:close={() => (editIndex = -1)} menu={menus[editIndex]} on:save={updateMenu} />
{/if}

<style>
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    border: 1px solid #000;
    box-sizing: border-box;
    min-height: 100vh;
  }
  li {
    margin: 4px;
  }
  .menu-key {
    font-style: italic;
    text-decoration: underline;
  }
</style>
