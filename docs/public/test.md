Button

Buttons allow users to take actions and make choices with a single tap. Use buttons to communicate actions users can take throughout the UI in dialogs, forms, cards, and toolbars.

Installation
1

Install the package

npm install @assemble/components
Copy
2

Import the component

import '@assemble/components/button';
Copy
3

Use in your HTML

<asm-button label="Click me"></asm-button>
Copy
Variants
Filled

The default high-emphasis button for primary actions. Use sparingly to highlight the most important action on the page.

<asm-button label="Label"></asm-button>
<asm-button label="Label" start-icon="download"></asm-button>
<asm-button label="Disabled" disabled></asm-button>
Tonal

A softer emphasis button for secondary actions. Uses the surface container color with on-surface text.

<asm-button label="Label" variant="tonal"></asm-button>
<asm-button label="Label" variant="tonal" start-icon="settings"></asm-button>
<asm-button label="Disabled" variant="tonal" disabled></asm-button>
Text

A low-emphasis button for less prominent actions. No background, just label text.

<asm-button label="Label" variant="text"></asm-button>
<asm-button label="Label" variant="text" end-icon="arrow_forward"></asm-button>
<asm-button label="Disabled" variant="text" disabled></asm-button>
Outline

A medium-emphasis button with a border. Use for secondary actions alongside a filled button.

<asm-button label="Label" variant="outline"></asm-button>
<asm-button label="Label" variant="outline" start-icon="share"></asm-button>
<asm-button label="Disabled" variant="outline" disabled></asm-button>
Sizes

Buttons come in four sizes. Use default as the standard size.

<asm-button label="Huge" size="huge"></asm-button>
<asm-button label="Spacious" size="spacious"></asm-button>
<asm-button label="Default" size="default"></asm-button>
<asm-button label="Compact" size="compact"></asm-button>
Destructive

Add destructive for dangerous or irreversible actions. Supported on filled, tonal, and text variants.

<asm-button label="Remove" destructive></asm-button>
<asm-button label="Remove" variant="tonal" destructive></asm-button>
<asm-button label="Remove" variant="text" destructive></asm-button>
With Icons

Use start-icon and end-icon attributes with any Material Symbols icon name.

<asm-button label="Download" start-icon="download"></asm-button>
<asm-button label="Next" end-icon="arrow_forward"></asm-button>
<asm-button label="Share" start-icon="share" end-icon="open_in_new"></asm-button>
Guidelines
Use clear, concise labels that describe the action
Place the primary action button on the right in dialogs
Avoid using too many buttons in one view
Use filled buttons sparingly to emphasize the most important action
Use destructive variant only for irreversible actions like delete
API
Web
Property	Type	Default	Description
label	string	''	The button label text
variant	filled | tonal | text | outline	filled	The visual style
size	huge | spacious | default | compact	default	The button size
disabled	boolean	false	Whether the button is disabled
destructive	boolean	false	Destructive/danger mode
start-icon	string	''	Material Symbols icon name before label
end-icon	string	''	Material Symbols icon name after label
Flutter
Parameter	Type	Default	Description
label	String	required	The button label text
onPressed	VoidCallback?	null	Tap handler. null disables the button
startIcon	Widget?	null	Leading icon widget
endIcon	Widget?	null	Trailing icon widget
variant	AsmButtonVariant	.filled	The visual style
size	AsmButtonSize	.default	The button size
destructive	bool	false	Destructive/danger mode