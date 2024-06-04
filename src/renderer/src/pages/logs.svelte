<script lang="ts">
  import { onMount, tick } from 'svelte'

  let logs = ''
  onMount(() => {
    getLogs().then(scrollToEnd)
    const id = setInterval(getLogs, 3000)
    return () => clearInterval(id)
  })
  async function getLogs() {
    const isScrollEnd = el?.scrollTop + el?.clientHeight === el?.scrollHeight
    logs = await window.electron.ipcRenderer.invoke('getLogs')
    if (isScrollEnd) {
      await tick()
      scrollToEnd()
    }
  }
  let el: HTMLPreElement
  function scrollToEnd() {
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }
</script>

<pre bind:this={el}>
  {logs}
</pre>

<style>
  pre {
    height: calc(100vh - 80px);
    overflow: auto;
    text-wrap: wrap;
    word-wrap: break-word;
    padding: 0 1rem;
    box-sizing: border-box;
  }
</style>
