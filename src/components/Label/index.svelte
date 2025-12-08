<script>

    export let size = 'medium'; // medium, small
    export let text = ''; // Label text (falls back to slot content if provided)
    let className = '';
    export { className as class };

</script>

<label class="label {size} {className}">
    <slot>{text}</slot>
</label>

<style>

    .label {
        color: var(--figma-color-text);
        width: 100%;
        display: flex;
        align-items: center;
        cursor: default;
        user-select: none;
    }

    .label.medium {
        font-size: var(--body-medium-font-size);
        line-height: var(--body-medium-line-height);
        letter-spacing: var(--body-medium-letter-spacing);
        font-weight: var(--body-medium-font-weight);
    }

    .label.small {
        font-size: var(--body-small-font-size);
        line-height: var(--body-small-line-height);
        letter-spacing: var(--body-small-letter-spacing);
        font-weight: var(--body-small-font-weight);
    }

</style>