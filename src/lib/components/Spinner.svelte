<span class="loader"></span>

<style>
    .loader {
        width: 36px;
        height: 36px;
        border: 5px solid oklch(70.8% 0 0);
        border-bottom-color: oklch(14.5% 0 0);
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
