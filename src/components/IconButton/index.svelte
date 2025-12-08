<script>
    import Icon from './../Icon/index.svelte';

    export let iconName = '';
    export let iconText = null;
    export let variant = 'default'; // default, secondary
    export let disabled = false;
    export let spin = false;
    export let tabindex = 0;
    export let iconColor = null; // Optional: override icon color

    let className = '';
    export { className as class };
    let buttonElement;
    
    // Export the button element for external binding
    export { buttonElement as element };

    // Reactive: Determine the correct icon color based on variant and state
    // This needs to be reactive so it updates when iconColor prop changes
    $: computedColor = iconColor 
        ? iconColor 
        : disabled 
            ? '--figma-color-icon-disabled' 
            : '--figma-color-icon';

</script>

<button 
    bind:this={buttonElement}
    on:click
    on:blur
    on:focus
    onclick="this.blur();" 
    class="icon-button {className}"
    class:default={variant === 'default'}
    class:secondary={variant === 'secondary'}
    class:disabled={disabled}
    {disabled}
    {tabindex}
>
    <Icon {iconName} {iconText} {spin} color={computedColor}/>
</button>

<style>
    .icon-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--size-small); /* 24px */
        height: var(--size-small); /* 24px */
        border-radius: var(--border-radius-medium); /* 5px */
        border: 1px solid transparent;
        background-color: transparent;
        cursor: pointer;
        outline: none;
        transition: all 0.15s ease;
    }

    /* DEFAULT VARIANT */
    .icon-button.default:hover:not(:disabled) {
        background-color: var(--color-bg-transparent-hover);
    }

    .icon-button.default:active:not(:disabled) {
        background-color: var(--color-bg-transparent-pressed);
    }

    .icon-button.default:focus-visible {
        outline: 1px solid var(--figma-color-border-selected);
        outline-offset: -1px;
    }

    .icon-button.default:disabled {
        cursor: not-allowed;
    }

    /* SECONDARY VARIANT */
    .icon-button.secondary {
        border: 1px solid var(--color-border-transparent);
    }

    .icon-button.secondary:hover:not(:disabled) {
        background-color: var(--color-bg-transparent-hover);
    }

    .icon-button.secondary:active:not(:disabled) {
        background-color: var(--color-bg-transparent-pressed);
    }

    .icon-button.secondary:focus-visible {
        outline: 1px solid var(--figma-color-border-selected);
        outline-offset: -1px;
    }

    .icon-button.secondary:disabled {
        cursor: not-allowed;
    }

    /* Remove focus outline for mouse clicks */
    .icon-button:focus:not(:focus-visible) {
        outline: none;
    }
</style>