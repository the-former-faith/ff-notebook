<script>
  import DetailsSummary from '$lib/components/molecules/DetailsSummary.svelte'
  export let editor
  export let levels = [2, 3, 4, 5, 6]
</script>

<DetailsSummary 
  title='H<span class="screen-reader-text">eading</span>'
  styleOverlay={true}
  active={editor.isActive('heading')}
>
  <ul>
    {#each levels as i }
      <li>
        <button
          on:click={() => editor.chain().focus().toggleHeading({ level: i }).run()}
          class:active={editor.isActive('heading', { level: i })}
          disabled={!editor.can().toggleHeading({ level: i })}
          aria-disabled={!editor.can().toggleHeading({ level: i })}
        >
          H{i}
        </button>
      </li>
    {/each}
  </ul>
</DetailsSummary>

<style>
  ul {
    list-style: none;
    padding: 0;
  }
</style>