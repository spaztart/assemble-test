---
layout: ../layouts/MarkdownLayout.astro
title: Design Resources - Design System
description: Access design resources for the Assemble design system
---

# Design Resources

Access the Assemble design system resources — Figma libraries, icon sets, and more.

<div class="resource-cards">
  <asm-card variant="surface" elevation="5">
    <h3>Components <span class="figma-icon" aria-hidden="true"></span></h3>
    <p>The complete Figma component kit — buttons, inputs, cards, navigation, and all production UI components.</p>
    <a href="https://www.figma.com/design/iVTlxS6fYrXqHTqmV7yb98/Components?m=auto&node-id=0-1&t=Xcac4NWFGHHAnOFn-1" class="resource-link" target="_blank" rel="noopener noreferrer">View in Figma <span class="material-symbols-outlined" aria-hidden="true">open_in_new</span></a>
  </asm-card>

  <asm-card variant="surface" elevation="5">
    <h3>Visual Foundations <span class="figma-icon" aria-hidden="true"></span></h3>
    <p>Colors, typography, spacing, elevation, and core visual design tokens in Figma.</p>
    <a href="https://www.figma.com/design/HopsrAa5hv2AarZp2P2Y77/Visual-Foundations?m=auto&node-id=0-1&t=UmZ5JJ7T5THpI29Z-1" class="resource-link" target="_blank" rel="noopener noreferrer">View in Figma <span class="material-symbols-outlined" aria-hidden="true">open_in_new</span></a>
  </asm-card>

  <asm-card variant="surface" elevation="5">
    <h3>Material Icons <span class="material-symbols-outlined" style="font-size: 20px; vertical-align: middle;" aria-hidden="true">verified</span></h3>
    <p>Google's Material Design icon set — thousands of icons in outlined, rounded, and sharp styles.</p>
    <a href="https://github.com/google/material-design-icons" class="resource-link" target="_blank" rel="noopener noreferrer">Visit Material Icons <span class="material-symbols-outlined" aria-hidden="true">open_in_new</span></a>
  </asm-card>

  <asm-card variant="surface" elevation="5" class="coming-soon">
    <h3>Illustrations (WIP)</h3>
    <p>A library of brand illustrations and graphic assets for use across products.</p>
    <span class="resource-link disabled">(coming soon)</span>
  </asm-card>
</div>

<style>
  .resource-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 1fr;
    gap: 1.25rem;
    margin: 2.5rem 0;
  }

  .resource-cards asm-card {
    --asm-card-padding: 2rem 1.75rem;
    --asm-card-radius: 16px;
    display: flex;
    height: 100%;
  }

  .resource-cards asm-card::part(card) {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .resource-cards asm-card h3 {
    margin: 0 0 0.75rem;
    font-size: 1.375rem;
    font-weight: 700;
    color: var(--md-sys-color-on-surface);
    font-family: 'McAfee Sans', system-ui, sans-serif;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .resource-cards asm-card p {
    margin: 0;
    font-size: 0.9375rem;
    line-height: 1.6;
    color: var(--md-sys-color-on-surface-variant);
    flex: 1;
  }

  .resource-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: auto;
    padding-top: 1.25rem;
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--md-sys-color-on-surface);
    text-decoration: none;
  }

  .resource-link .material-symbols-outlined {
    font-size: 16px;
    text-decoration: none;

  }

  .resource-link:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .resource-link.disabled {
    color: var(--md-sys-color-on-surface-variant);
    text-decoration: none;
    font-weight: 400;
  }

  .coming-soon {
    opacity: 0.75;
  }

  .figma-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 38 57' fill='none'%3E%3Cpath d='M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z' fill='%231ABCFE'/%3E%3Cpath d='M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z' fill='%230ACF83'/%3E%3Cpath d='M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z' fill='%23FF7262'/%3E%3Cpath d='M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z' fill='%23F24E1E'/%3E%3Cpath d='M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z' fill='%23A259FF'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    vertical-align: middle;
  }

  @media (max-width: 768px) {
    .resource-cards {
      grid-template-columns: 1fr;
    }
  }
</style>
