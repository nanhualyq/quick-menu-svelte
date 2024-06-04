<script lang="ts">
  import settings from './pages/settings.svelte'
  import menus from './pages/menus.svelte'
  import logs from './pages/logs.svelte'
  const hash = window.location.hash.slice(1)
  let activeName = hash || 'settings'
  const map = new Map([
    ['settings', settings],
    ['menus', menus],
    ['logs', logs]
  ])
  $: activeComponent = map.get(activeName)
  const navList = [
    ['Settings', 'settings'],
    ['Menus', 'menus'],
    ['Logs', 'logs']
  ]
</script>

<div>
  {#if !hash}
    <nav>
      {#each navList as [label, name] (name)}
        <label>
          {label}
          <input
            type="radio"
            style="display: none;"
            value={name}
            bind:group={activeName}
            checked={activeName === name}
          />
        </label>
      {/each}
    </nav>
  {/if}
  <svelte:component this={activeComponent}></svelte:component>
</div>

<style>
  nav {
    background-color: #999;
  }
  label {
    cursor: pointer;
    display: inline-block;
    padding: 1rem;
  }
  label:has(:checked) {
    background-color: #fff;
  }
</style>
