<script>
	let files
</script>

<label for="image">Choose a profile picture:</label>
<input
  type="file"
  id="image"
  name="image"
  accept="image/*"
  label="hey"
  bind:files
  on:change={(e) => console.log(e)}
/>

<style>
  input[type=file] {
    font-size: inherit;
  }

  input[type=file]::file-selector-button {
    border: 0;
    padding: .5rem 1rem;
    background-color: var(--action-color);
    transition: 1s;
  }
</style>