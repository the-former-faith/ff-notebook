<script>
  export let editor
  export let levels = [2, 3, 4, 5, 6]
</script>

<details>
  <summary>H<span class="screen-reader-text">eading</span></summary>
  <ul>
    {#each levels as i }
      <li>
        <button
          on:click={() => editor.chain().focus().toggleHeading({ level: i }).run()}
          class:active={editor.isActive('heading', { level: i })}
        >
          H{i}
        </button>
      </li>
    {/each}
  </ul>
</details>

<style>
  details {
    position: relative;
  }
  ul {
    list-style: none;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
  }
</style>