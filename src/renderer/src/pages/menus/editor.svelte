<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import type { Menu } from '../../../../types'
  import { cloneDeep } from 'lodash'

  let el: HTMLDialogElement
  const dispatch = createEventDispatcher()
  export let menu: Menu
  const formData = cloneDeep(menu)

  onMount(() => {
    el.showModal()
    dispatch('show')
  })
</script>

<dialog bind:this={el} on:close>
  <form on:submit|preventDefault={() => dispatch('save', formData)}>
    <label>
      <span>Name</span>
      <input type="text" bind:value={formData.name} />
    </label>
    <label>
      <span>Code</span>
      <textarea bind:value={formData.code}></textarea>
    </label>
    <button>Save</button>
  </form>
</dialog>

<style>
  label {
    display: block;
    padding: 0.5rem;
  }
  label span {
    display: inline-block;
    min-width: 4rem;
  }
  label span::after {
    content: ':';
  }
  textarea {
    min-width: 20rem;
    min-height: 10rem;
  }
</style>
