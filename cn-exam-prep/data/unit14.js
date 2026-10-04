// Unit data: generated from the authoring builder; plain JSON object literal (valid JS).
window.UNITS = window.UNITS || {};
window.UNITS["unit14"] = {
 "id": "unit14",
 "num": 14,
 "day": 5,
 "title": "Subnetting in Practice & AWS VPC Design",
 "lectures": "Lecture 14 · SL-L14 · Labs A3, A4",
 "overview": "<p>Subnetting means borrowing k host bits to get $2^k$ subnets of $2^{h-k}$ addresses. With the magic number (256 − mask octet) you can find any address's network, broadcast and host range in seconds. On the AWS side, the route table decides whether a subnet is public or private, and a 3-tier design is repeated across 2 AZs. AWS reserves 5 addresses per subnet and only allows /16 to /28 blocks with no overlaps. The lab section walks through the graded VPC and security-group builds, and the extra section covers VLSM.</p>",
 "sections": [
  {
   "id": "14-A",
   "title": "Subnetting: Splitting One Network by Borrowing Host Bits",
   "badge": "class",
   "source": "SL-L14 p3–6",
   "covers": [
    "14.1",
    "14.2"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "One big office becomes four departments",
     "html": "<p><b>Analogy (SL-L14 p5).</b> One huge open-plan office (one network) is noisy and hard to secure. Splitting it into Sales, HR, Finance and IT rooms gives each team its own smaller space while the building address stays the same.</p><p><b>Definition (SL-L14 p5–6; RFC 950).</b> <b>Subnetting</b> splits one network into smaller networks by <b>borrowing k bits from the host part</b>. Those k bits become the <b>Subnet ID</b>. The prefix grows from /n to /(n + k). The result is $2^{k}$ subnets, each with $2^{h-k}$ addresses, where $h = 32 - n$. Why do it: smaller broadcast domains, isolation between groups (security), and route tables that can treat each group differently (the basis of public and private subnets in a VPC).</p>"
    },
    {
     "type": "callout",
     "kind": "slidefix",
     "title": "SL-L14 p3 recap repeats the 172.16.1.10 split",
     "html": "<p>The recap again shows 172.16.1.10 as Network 172.16.1 | Host 10. Under <b>classful</b> rules 172.x is Class B, so it is <b>172.16 | 1.10</b> (see Unit 13). The slide's split only holds if the address is written with an explicit <b>/24</b>, i.e. 172.16.1.10/24.</p>"
    },
    {
     "type": "figure",
     "caption": "Network | Subnet | Host split for 10.0.0.0/24 → /26 (SL-L14 p6): blue = original Network ID, green = 2 borrowed Subnet ID bits, amber = 6 remaining Host ID bits.",
     "html": "<svg viewBox='0 0 776 210' width='100%' font-family='monospace'><text x='206' y='14' text-anchor='middle' fill='var(--muted)' font-size='11'>octet 1 (bits 0-7)</text><text x='324' y='14' text-anchor='middle' fill='var(--muted)' font-size='11'>octet 2 (bits 8-15)</text><text x='442' y='14' text-anchor='middle' fill='var(--muted)' font-size='11'>octet 3 (bits 16-23)</text><text x='560' y='14' text-anchor='middle' fill='var(--muted)' font-size='11'>octet 4 (bits 24-31)</text><text x='142' y='43' text-anchor='end' fill='currentColor' font-size='12'>10.0.0.0/24</text><rect x='150' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='156' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='164' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='170' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='178' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='184' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='192' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='198' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='206' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='212' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='220' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='226' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='234' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='240' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='248' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='254' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='268' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='274' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='282' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='288' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='296' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='302' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='310' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='316' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='324' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='330' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='338' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='344' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='352' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='358' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='366' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='372' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='386' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='392' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='400' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='406' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='414' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='420' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='428' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='434' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='442' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='448' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='456' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='462' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='470' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='476' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='484' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='490' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='504' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='510' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='518' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='524' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='532' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='538' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='546' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='552' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='560' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='566' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='574' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='580' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='588' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='594' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='602' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='608' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><text x='626' y='43' fill='currentColor' font-size='12'>1 network, 256 addr</text><text x='142' y='73' text-anchor='end' fill='currentColor' font-size='12'>borrow k = 2</text><rect x='150' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='156' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='164' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='170' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='178' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='184' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='192' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='198' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='206' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='212' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='220' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='226' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='234' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='240' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='248' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='254' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='268' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='274' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='282' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='288' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='296' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='302' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='310' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='316' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='324' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='330' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='338' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='344' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='352' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='358' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='366' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='372' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='386' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='392' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='400' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='406' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='414' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='420' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='428' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='434' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='442' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='448' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='456' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='462' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='470' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='476' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='484' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='490' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='504' y='56' width='13' height='22' fill='var(--ok)' fill-opacity='0.22' stroke='var(--ok)' stroke-width='1'/><text x='510' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='518' y='56' width='13' height='22' fill='var(--ok)' fill-opacity='0.22' stroke='var(--ok)' stroke-width='1'/><text x='524' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='532' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='538' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='546' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='552' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='560' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='566' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='574' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='580' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='588' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='594' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='602' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='608' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><text x='626' y='73' fill='currentColor' font-size='12'>/26: 4 x 64 addr</text><text x='142' y='103' text-anchor='end' fill='currentColor' font-size='12'>subnet 2 (01)</text><rect x='150' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='156' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='164' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='170' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='178' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='184' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='192' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='198' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='206' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='212' y='101' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='220' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='226' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='234' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='240' y='101' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='248' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='254' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='268' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='274' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='282' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='288' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='296' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='302' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='310' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='316' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='324' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='330' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='338' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='344' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='352' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='358' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='366' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='372' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='386' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='392' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='400' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='406' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='414' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='420' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='428' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='434' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='442' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='448' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='456' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='462' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='470' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='476' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='484' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='490' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='504' y='86' width='13' height='22' fill='var(--ok)' fill-opacity='0.22' stroke='var(--ok)' stroke-width='1'/><text x='510' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='518' y='86' width='13' height='22' fill='var(--ok)' fill-opacity='0.22' stroke='var(--ok)' stroke-width='1'/><text x='524' y='101' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='532' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='538' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='546' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='552' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='560' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='566' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='574' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='580' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='588' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='594' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='602' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='608' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><text x='626' y='103' fill='currentColor' font-size='12'>10.0.0.64/26</text><text x='142' y='133' text-anchor='end' fill='currentColor' font-size='12'>subnet 3 (10)</text><rect x='150' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='156' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='164' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='170' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='178' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='184' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='192' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='198' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='206' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='212' y='131' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='220' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='226' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='234' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='240' y='131' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='248' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='254' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='268' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='274' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='282' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='288' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='296' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='302' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='310' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='316' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='324' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='330' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='338' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='344' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='352' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='358' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='366' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='372' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='386' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='392' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='400' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='406' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='414' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='420' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='428' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='434' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='442' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='448' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='456' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='462' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='470' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='476' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='484' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='490' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='504' y='116' width='13' height='22' fill='var(--ok)' fill-opacity='0.22' stroke='var(--ok)' stroke-width='1'/><text x='510' y='131' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='518' y='116' width='13' height='22' fill='var(--ok)' fill-opacity='0.22' stroke='var(--ok)' stroke-width='1'/><text x='524' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='532' y='116' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='538' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='546' y='116' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='552' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='560' y='116' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='566' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='574' y='116' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='580' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='588' y='116' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='594' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='602' y='116' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='608' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><text x='626' y='133' fill='currentColor' font-size='12'>10.0.0.128/26</text><text x='142' y='163' text-anchor='end' fill='currentColor' font-size='12'>host .130 in 3</text><rect x='150' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='156' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='164' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='170' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='178' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='184' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='192' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='198' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='206' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='212' y='161' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='220' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='226' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='234' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='240' y='161' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='248' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='254' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='268' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='274' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='282' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='288' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='296' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='302' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='310' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='316' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='324' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='330' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='338' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='344' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='352' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='358' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='366' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='372' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='386' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='392' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='400' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='406' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='414' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='420' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='428' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='434' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='442' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='448' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='456' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='462' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='470' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='476' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='484' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='490' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='504' y='146' width='13' height='22' fill='var(--ok)' fill-opacity='0.22' stroke='var(--ok)' stroke-width='1'/><text x='510' y='161' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='518' y='146' width='13' height='22' fill='var(--ok)' fill-opacity='0.22' stroke='var(--ok)' stroke-width='1'/><text x='524' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='532' y='146' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='538' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='546' y='146' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='552' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='560' y='146' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='566' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='574' y='146' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='580' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='588' y='146' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='594' y='161' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='602' y='146' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='608' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><text x='626' y='163' fill='currentColor' font-size='12'>subnet 10, host 000010</text><rect x='150' y='188' width='14' height='14' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)'/><text x='170' y='200' fill='currentColor' font-size='12'>Network ID bits</text><rect x='310' y='188' width='14' height='14' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)'/><text x='330' y='200' fill='currentColor' font-size='12'>Host ID bits</text><rect x='446' y='188' width='14' height='14' fill='var(--ok)' fill-opacity='0.22' stroke='var(--ok)'/><text x='466' y='200' fill='currentColor' font-size='12'>Subnet ID bits (borrowed)</text></svg>"
    },
    {
     "type": "derivation",
     "title": "Borrowing k bits (SL-L14 p6)",
     "steps": [
      {
       "tex": "h = 32 - n = 32 - 24 = 8",
       "why": "Host bits of the original /24."
      },
      {
       "tex": "\\text{subnets} = 2^{k}",
       "why": "The k borrowed bits can take every value from 00 to 11 (k bits)."
      },
      {
       "tex": "\\text{addresses per subnet} = 2^{h-k}",
       "why": "Only h − k bits are left for hosts."
      },
      {
       "tex": "4 = 2^{2} \\Rightarrow k = 2",
       "why": "Need 4 subnets (SL-L14 p6); in general k = ⌈log₂(subnets needed)⌉."
      },
      {
       "tex": "n' = n + k = 24 + 2 = 26",
       "why": "Borrowed bits join the prefix."
      },
      {
       "tex": "2^{8-2} = 64 \\text{ addresses},\\; 64 - 2 = 62 \\text{ usable}",
       "why": "Each /26 has 64 addresses; generic usable = 62 (AWS: 59)."
      },
      {
       "tex": "2^{k} \\times 2^{h-k} = 2^{h} = 256",
       "why": "Subnetting never creates addresses; it only divides the 256."
      }
     ]
    },
    {
     "type": "table",
     "head": [
      "Borrowed k",
      "New prefix",
      "Subnets $2^k$",
      "Addresses each $2^{8-k}$",
      "Usable (−2)",
      "AWS usable (−5)"
     ],
     "rows": [
      [
       "1",
       "/25",
       "2",
       "128",
       "126",
       "123"
      ],
      [
       "2",
       "/26",
       "4",
       "64",
       "62",
       "59"
      ],
      [
       "3",
       "/27",
       "8",
       "32",
       "30",
       "27"
      ],
      [
       "4",
       "/28",
       "16",
       "16",
       "14",
       "11"
      ],
      [
       "5",
       "/29",
       "32",
       "8",
       "6",
       "not allowed (AWS minimum is /28)"
      ],
      [
       "6",
       "/30",
       "64",
       "4",
       "2",
       "not allowed"
      ]
     ],
     "caption": "Splitting a /24 by borrowing k bits."
    },
    {
     "type": "cheat",
     "title": "Borrowing formulas",
     "items": [
      "$k = \\lceil \\log_2 S \\rceil$ for S subnets",
      "subnets $= 2^{k}$; addresses each $= 2^{h-k}$; new prefix $= n + k$",
      "Borrowing from a /24: k = 1 → .128 mask, 2 → .192, 3 → .224, 4 → .240, 5 → .248, 6 → .252",
      "The original block size never changes: $2^{k} \\cdot 2^{h-k} = 2^{h}$"
     ]
    },
    {
     "type": "worked",
     "title": "Six departments in 192.168.5.0/24",
     "tag": "University-Midsem-style",
     "problem": "<p>192.168.5.0/24 must be split into at least 6 equal subnets. Find k, the new prefix and mask, the number of subnets, addresses and usable hosts per subnet, and the first three subnet addresses.</p>",
     "steps": [
      {
       "tex": "2^{2} = 4 < 6 \\le 8 = 2^{3} \\Rightarrow k = 3",
       "why": "Two bits give only 4 subnets."
      },
      {
       "tex": "n' = 24 + 3 = 27,\\; \\text{mask } 255.255.255.224",
       "why": "224 = 11100000."
      },
      {
       "tex": "2^{3} = 8 \\text{ subnets}",
       "why": "Two are spare for growth."
      },
      {
       "tex": "2^{8-3} = 32 \\text{ addresses},\\; 32 - 2 = 30 \\text{ usable}",
       "why": "5 host bits remain."
      },
      {
       "text": "Subnet ID bits 000, 001, 010 → last octet 0, 32, 64: 192.168.5.0/27, 192.168.5.32/27, 192.168.5.64/27.",
       "why": "Each subnet starts 32 after the previous one."
      }
     ],
     "answer": "<b>k = 3, /27 (255.255.255.224), 8 subnets of 32 addresses (30 usable); 192.168.5.0, .32, .64 are the first three.</b>"
    },
    {
     "type": "code",
     "file": "Unit14_subnet_vlsm_bitwise.py",
     "level": "low",
     "title": "split(cidr, k): borrow k bits and list every subnet with shifts"
    },
    {
     "type": "traps",
     "items": [
      "Need 6 subnets → k = 3 (not 2, and not 6).",
      "Subnets grow the prefix (/24 → /26); aggregation (supernetting) shrinks it.",
      "Count of subnets and hosts are both powers of two; \"5 subnets\" is impossible, you get 8.",
      "Old textbooks excluded the all-0 and all-1 subnets (2^k − 2); modern practice (RFC 1878, ip subnet-zero) and the slides use all $2^k$."
     ]
    }
   ],
   "practice": [
    {
     "id": "u14-A-1",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "14.2",
     "q": "<p>Borrowing 3 host bits creates how many subnets? (integer)</p>",
     "answer": 8,
     "tol": 0,
     "unit": "subnets",
     "verify": "2**3",
     "steps": [
      {
       "tex": "2^{3} = 8",
       "why": "Each borrowed bit doubles the number of subnets."
      }
     ],
     "explain": "<p><b>8</b>.</p>"
    },
    {
     "id": "u14-A-2",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "14.2",
     "q": "<p>A /24 is subnetted by borrowing 3 bits. How many addresses (total) does each subnet have? (integer)</p>",
     "answer": 32,
     "tol": 0,
     "unit": "addresses",
     "verify": "2**(8-3)",
     "steps": [
      {
       "tex": "h - k = 8 - 3 = 5",
       "why": "Host bits left."
      },
      {
       "tex": "2^{5} = 32",
       "why": "Addresses per subnet."
      }
     ],
     "explain": "<p><b>32</b> (30 usable).</p>"
    },
    {
     "id": "u14-A-3",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "14.2",
     "q": "<p>What is the minimum number of bits to borrow to get at least 6 subnets? (integer)</p>",
     "answer": 3,
     "tol": 0,
     "unit": "bits",
     "verify": "math.ceil(math.log2(6))",
     "steps": [
      {
       "tex": "\\lceil \\log_2 6 \\rceil = \\lceil 2.58 \\rceil = 3",
       "why": "Smallest k with 2^k ≥ 6."
      }
     ],
     "explain": "<p><b>3</b>.</p>"
    },
    {
     "id": "u14-A-4",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "14.2",
     "q": "<p>A /24 network borrows 4 bits. Write the new subnet mask in dotted decimal.</p>",
     "answer": "255.255.255.240",
     "verify": "'255.255.255.' + str(256 - 2**(8-4))",
     "steps": [
      {
       "tex": "24 + 4 = 28",
       "why": "New prefix."
      },
      {
       "tex": "11110000_2 = 240",
       "why": "Four ones in the last octet."
      }
     ],
     "explain": "<p>/28: last octet 11110000 = <b>240</b>.</p>"
    },
    {
     "id": "u14-A-5",
     "type": "num",
     "tag": "GATE-style",
     "topic": "14.2",
     "q": "<p>172.16.0.0/16 is divided into /20 subnets. How many subnets result? (integer)</p>",
     "answer": 16,
     "tol": 0,
     "unit": "subnets",
     "verify": "2**(20-16)",
     "steps": [
      {
       "tex": "k = 20 - 16 = 4",
       "why": "Borrowed bits."
      },
      {
       "tex": "2^{4} = 16",
       "why": "Subnets."
      }
     ],
     "explain": "<p><b>16</b>.</p>"
    },
    {
     "id": "u14-A-6",
     "type": "num",
     "tag": "GATE-style",
     "topic": "14.2",
     "q": "<p>10.0.0.0/8 must provide 1000 equal subnets. Using the smallest k, how many usable hosts (−2 rule) does each subnet have? (integer)</p>",
     "answer": 16382,
     "tol": 0,
     "unit": "hosts",
     "verify": "2**(32-8-math.ceil(math.log2(1000)))-2",
     "steps": [
      {
       "tex": "k = \\lceil \\log_2 1000 \\rceil = 10",
       "why": "2^9 = 512 is too few, 2^10 = 1024."
      },
      {
       "tex": "n' = 8 + 10 = 18",
       "why": "New prefix."
      },
      {
       "tex": "2^{14} - 2 = 16{,}382",
       "why": "14 host bits left."
      }
     ],
     "explain": "<p><b>16,382</b>.</p>"
    },
    {
     "id": "u14-A-7",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "14.1",
     "q": "<p>Which is <b>not</b> a reason to subnet a large network?</p>",
     "options": [
      "Smaller broadcast domains",
      "Isolating groups (for example web and database) for security",
      "Giving different route tables to different groups",
      "Increasing the total number of addresses in the block"
     ],
     "answer": 3,
     "why": [
      "Broadcasts stay inside each subnet.",
      "Firewall/route rules can differ per subnet.",
      "This is exactly how public and private subnets work in a VPC.",
      "Subnetting only divides the block: $2^k \\cdot 2^{h-k} = 2^h$."
     ],
     "explain": "<p>Subnetting never adds addresses.</p>"
    },
    {
     "id": "u14-A-8",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "14.2",
     "q": "<p>Predict the exact output.</p>",
     "code": "import ipaddress\ns = list(ipaddress.ip_network('10.0.0.0/24').subnets(prefixlen_diff=2))\nprint(len(s), s[1])",
     "answer": "4 10.0.0.64/26",
     "runCheck": true,
     "explain": "<p><code>prefixlen_diff=2</code> borrows 2 bits: 4 subnets; index 1 is the second one, 10.0.0.64/26.</p>"
    }
   ]
  },
  {
   "id": "14-B",
   "title": "The Magic-Number Method and the 4 × /26 Table",
   "badge": "class",
   "source": "SL-L14 p7–8",
   "covers": [
    "14.3"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "A ruler with tick marks every 64",
     "html": "<p><b>Intuition.</b> Subnets of equal size sit end to end like marks on a ruler. If the marks are 64 apart, the subnets start at 0, 64, 128, 192. To find which subnet an address belongs to, find the tick at or below it.</p><p><b>Method (SL-L14 p7).</b> The <b>magic number</b> (block size) is $256 - $ the <b>interesting octet</b> of the mask (the one that is neither 255 nor 0). Network addresses are the multiples of the magic number in that octet; the broadcast is the next network minus 1.</p>"
    },
    {
     "type": "figure",
     "caption": "SL-L14 p7: 10.0.0.0/24 split into four /26 blocks of 64.",
     "html": "<svg viewBox='0 0 720 130' width='100%' font-family='sans-serif'><rect x='20' y='30' width='170' height='50' rx='4' fill='var(--ok)' fill-opacity='0.18' stroke='var(--ok)'/><text x='105' y='52' text-anchor='middle' fill='currentColor' font-size='13'>10.0.0.0/26</text><text x='105' y='70' text-anchor='middle' fill='var(--muted)' font-size='12'>.0 to .63</text><rect x='192' y='30' width='170' height='50' rx='4' fill='var(--accent)' fill-opacity='0.18' stroke='var(--accent)'/><text x='277' y='52' text-anchor='middle' fill='currentColor' font-size='13'>10.0.0.64/26</text><text x='277' y='70' text-anchor='middle' fill='var(--muted)' font-size='12'>.64 to .127</text><rect x='364' y='30' width='170' height='50' rx='4' fill='var(--warn)' fill-opacity='0.18' stroke='var(--warn)'/><text x='449' y='52' text-anchor='middle' fill='currentColor' font-size='13'>10.0.0.128/26</text><text x='449' y='70' text-anchor='middle' fill='var(--muted)' font-size='12'>.128 to .191</text><rect x='536' y='30' width='170' height='50' rx='4' fill='var(--bad)' fill-opacity='0.18' stroke='var(--bad)'/><text x='621' y='52' text-anchor='middle' fill='currentColor' font-size='13'>10.0.0.192/26</text><text x='621' y='70' text-anchor='middle' fill='var(--muted)' font-size='12'>.192 to .255</text><line x1='20' y1='84' x2='20' y2='96' stroke='currentColor'/><text x='20' y='112' text-anchor='middle' fill='currentColor' font-size='12'>0</text><line x1='192' y1='84' x2='192' y2='96' stroke='currentColor'/><text x='192' y='112' text-anchor='middle' fill='currentColor' font-size='12'>64</text><line x1='364' y1='84' x2='364' y2='96' stroke='currentColor'/><text x='364' y='112' text-anchor='middle' fill='currentColor' font-size='12'>128</text><line x1='536' y1='84' x2='536' y2='96' stroke='currentColor'/><text x='536' y='112' text-anchor='middle' fill='currentColor' font-size='12'>192</text><line x1='20' y1='90' x2='708' y2='90' stroke='currentColor'/><text x='700' y='112' text-anchor='end' fill='currentColor' font-size='12'>255</text><text x='360' y='20' text-anchor='middle' fill='currentColor' font-size='13'>last octet: block size = magic number = 256 - 192 = 64</text></svg>"
    },
    {
     "type": "derivation",
     "title": "Why 256 − mask octet is the block size",
     "steps": [
      {
       "tex": "\\text{mask octet} = 256 - 2^{b}",
       "why": "An octet with (8 − b) leading ones and b trailing zeros equals 256 − 2^b (e.g. 192 = 256 − 64)."
      },
      {
       "tex": "M = 256 - \\text{mask octet} = 2^{b}",
       "why": "So the magic number is the size of one block in that octet."
      },
      {
       "tex": "/26:\\; 256 - 192 = 64",
       "why": "SL-L14 p7."
      },
      {
       "tex": "\\text{network octet} = \\lfloor x / M \\rfloor \\times M",
       "why": "Round the address's interesting octet down to a multiple of M."
      },
      {
       "tex": "\\text{broadcast octet} = \\text{network octet} + M - 1",
       "why": "Last address before the next block; later octets become 255."
      },
      {
       "tex": "138:\\; \\lfloor 138/32 \\rfloor \\times 32 = 4 \\times 32 = 128",
       "why": "Example used in the worked problem below (/27, M = 32)."
      }
     ]
    },
    {
     "type": "table",
     "head": [
      "Subnet",
      "Network",
      "First usable",
      "Last usable",
      "Broadcast",
      "Usable (generic)",
      "Usable (AWS)"
     ],
     "rows": [
      [
       "1",
       "10.0.0.0/26",
       "10.0.0.1",
       "10.0.0.62",
       "10.0.0.63",
       "62",
       "59 (10.0.0.4 – 10.0.0.62)"
      ],
      [
       "2",
       "10.0.0.64/26",
       "10.0.0.65",
       "10.0.0.126",
       "10.0.0.127",
       "62",
       "59 (10.0.0.68 – 10.0.0.126)"
      ],
      [
       "3",
       "10.0.0.128/26",
       "10.0.0.129",
       "10.0.0.190",
       "10.0.0.191",
       "62",
       "59 (10.0.0.132 – 10.0.0.190)"
      ],
      [
       "4",
       "10.0.0.192/26",
       "10.0.0.193",
       "10.0.0.254",
       "10.0.0.255",
       "62",
       "59 (10.0.0.196 – 10.0.0.254)"
      ]
     ],
     "caption": "SL-L14 p8, verified with Python ipaddress. The AWS column is not on the slide: in AWS the first four and the last address of each subnet are reserved."
    },
    {
     "type": "table",
     "head": [
      "Prefix",
      "Mask",
      "Interesting octet",
      "Magic number"
     ],
     "rows": [
      [
       "/17",
       "255.255.128.0",
       "3rd",
       "128"
      ],
      [
       "/18",
       "255.255.192.0",
       "3rd",
       "64"
      ],
      [
       "/19",
       "255.255.224.0",
       "3rd",
       "32"
      ],
      [
       "/20",
       "255.255.240.0",
       "3rd",
       "16"
      ],
      [
       "/21",
       "255.255.248.0",
       "3rd",
       "8"
      ],
      [
       "/22",
       "255.255.252.0",
       "3rd",
       "4"
      ],
      [
       "/23",
       "255.255.254.0",
       "3rd",
       "2"
      ],
      [
       "/25",
       "255.255.255.128",
       "4th",
       "128"
      ],
      [
       "/26",
       "255.255.255.192",
       "4th",
       "64"
      ],
      [
       "/27",
       "255.255.255.224",
       "4th",
       "32"
      ],
      [
       "/28",
       "255.255.255.240",
       "4th",
       "16"
      ],
      [
       "/29",
       "255.255.255.248",
       "4th",
       "8"
      ],
      [
       "/30",
       "255.255.255.252",
       "4th",
       "4"
      ]
     ],
     "caption": "Magic numbers for the common prefixes."
    },
    {
     "type": "cheat",
     "title": "Magic-number recipe",
     "items": [
      "1. Find the interesting octet (mask neither 255 nor 0)",
      "2. M = 256 − mask octet",
      "3. Network = largest multiple of M ≤ the address octet; later octets → 0",
      "4. Broadcast = network + M − 1; later octets → 255",
      "5. First = network + 1; last = broadcast − 1; usable = $2^{h} - 2$"
     ]
    },
    {
     "type": "worked",
     "title": "GATE-style: 192.168.10.138/27",
     "tag": "GATE-style",
     "problem": "<p>A host is configured as 192.168.10.138/27. Find the network address, first usable host, last usable host, broadcast address and number of usable hosts in its subnet.</p>",
     "steps": [
      {
       "tex": "/27 \\Rightarrow 255.255.255.224",
       "why": "27 = 24 + 3 ones in the last octet: 11100000 = 224."
      },
      {
       "tex": "M = 256 - 224 = 32",
       "why": "Subnets start at 0, 32, 64, 96, 128, 160, 192, 224 in the last octet."
      },
      {
       "tex": "\\lfloor 138 / 32 \\rfloor = 4 \\Rightarrow 4 \\times 32 = 128",
       "why": "128 is the largest multiple of 32 not above 138."
      },
      {
       "tex": "\\text{check: } 138 = 10001010_2 \\wedge 11100000_2 = 10000000_2 = 128",
       "why": "The bitwise AND agrees."
      },
      {
       "tex": "\\text{broadcast} = 128 + 32 - 1 = 159",
       "why": "One below the next network (160)."
      },
      {
       "tex": "\\text{first} = 129,\\; \\text{last} = 158",
       "why": "Network + 1 and broadcast − 1."
      },
      {
       "tex": "2^{32-27} - 2 = 32 - 2 = 30",
       "why": "5 host bits."
      }
     ],
     "answer": "<b>Network 192.168.10.128, first 192.168.10.129, last 192.168.10.158, broadcast 192.168.10.159, 30 usable hosts.</b>"
    },
    {
     "type": "code",
     "file": "Unit14_subnet_vlsm_bitwise.py",
     "level": "low",
     "title": "magic_number(n) and the 4 × /26 table with asserts"
    },
    {
     "type": "traps",
     "items": [
      "The magic number applies to the <b>interesting</b> octet only: for /20 it is 16 in the third octet, and the fourth octet runs 0–255 inside each block.",
      "Network .64 and broadcast .63 are not host addresses; .64 is subnet 2's network address.",
      "Broadcast = next network − 1, not network + M.",
      "With AWS, each /26 has 59 usable, not 62."
     ]
    }
   ],
   "practice": [
    {
     "id": "u14-B-1",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "14.3",
     "q": "<p>What is the magic number (block size) for a /28 mask? (integer)</p>",
     "answer": 16,
     "tol": 0,
     "unit": "",
     "verify": "256-240",
     "steps": [
      {
       "tex": "/28 \\Rightarrow 255.255.255.240",
       "why": "Four ones in the last octet."
      },
      {
       "tex": "256 - 240 = 16",
       "why": "Magic number."
      }
     ],
     "explain": "<p><b>16</b>.</p>"
    },
    {
     "id": "u14-B-2",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "14.3",
     "q": "<p>10.0.0.0/24 is split into four /26 subnets. What is the network address of the <b>third</b> subnet?</p>",
     "answer": "10.0.0.128",
     "verify": "'10.0.0.' + str(2*64)",
     "steps": [
      {
       "tex": "(3 - 1) \\times 64 = 128",
       "why": "Subnet i starts at (i − 1) × M."
      }
     ],
     "explain": "<p>Networks at 0, 64, 128, 192: the third is <b>10.0.0.128</b>.</p>"
    },
    {
     "id": "u14-B-3",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "14.3",
     "q": "<p>What is the broadcast address of the /26 subnet that contains 10.0.0.100?</p>",
     "answer": "10.0.0.127",
     "verify": "'10.0.0.' + str(100//64*64 + 63)",
     "steps": [
      {
       "tex": "\\lfloor 100/64 \\rfloor \\times 64 = 64",
       "why": "Network octet."
      },
      {
       "tex": "64 + 64 - 1 = 127",
       "why": "Broadcast octet."
      }
     ],
     "explain": "<p>100 lies in the 64 block (64–127): broadcast <b>10.0.0.127</b>.</p>"
    },
    {
     "id": "u14-B-4",
     "type": "text",
     "tag": "GATE-style",
     "topic": "14.3",
     "q": "<p>Find the network address of 172.20.77.9/21.</p>",
     "answer": "172.20.72.0",
     "verify": "'172.20.' + str(77//8*8) + '.0'",
     "steps": [
      {
       "tex": "M = 256 - 248 = 8",
       "why": "Interesting octet is the third."
      },
      {
       "tex": "\\lfloor 77/8 \\rfloor \\times 8 = 72",
       "why": "Round down."
      },
      {
       "tex": "\\text{octet 4} \\to 0",
       "why": "Everything after the interesting octet is host bits."
      }
     ],
     "explain": "<p>/21: mask 255.255.248.0, M = 8 in the third octet; 77 → 72. Network <b>172.20.72.0</b> (broadcast 172.20.79.255).</p>"
    },
    {
     "id": "u14-B-5",
     "type": "num",
     "tag": "GATE-style",
     "topic": "14.3",
     "q": "<p>For 200.1.1.75/29, what is the last octet of the <b>last usable</b> host? (integer)</p>",
     "answer": 78,
     "tol": 0,
     "unit": "",
     "verify": "75//8*8 + 8 - 2",
     "steps": [
      {
       "tex": "M = 256 - 248 = 8",
       "why": "/29 mask is 255.255.255.248."
      },
      {
       "tex": "\\lfloor 75/8 \\rfloor \\times 8 = 72",
       "why": "Network .72."
      },
      {
       "tex": "72 + 8 - 1 = 79",
       "why": "Broadcast .79."
      },
      {
       "tex": "79 - 1 = 78",
       "why": "Last usable."
      }
     ],
     "explain": "<p><b>78</b> (200.1.1.78).</p>"
    },
    {
     "id": "u14-B-6",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "14.3",
     "q": "<p>10.0.0.0/24 is split into /26 subnets. Which address can be assigned to a host?</p>",
     "options": [
      "10.0.0.63",
      "10.0.0.64",
      "10.0.0.128",
      "10.0.0.130"
     ],
     "answer": 3,
     "why": [
      "Broadcast of subnet 1.",
      "Network address of subnet 2.",
      "Network address of subnet 3.",
      "Inside subnet 3 (129–190): a usable host."
     ],
     "explain": "<p><b>10.0.0.130</b>.</p>"
    },
    {
     "id": "u14-B-7",
     "type": "msq",
     "tag": "GATE-style",
     "topic": "14.3",
     "q": "<p>Select ALL addresses in the same /27 subnet as 192.168.10.138.</p>",
     "options": [
      "192.168.10.129",
      "192.168.10.158",
      "192.168.10.160",
      "192.168.10.127"
     ],
     "answer": [
      0,
      1
     ],
     "why": [
      "In 128–159.",
      "In 128–159.",
      "160 starts the next /27.",
      "127 is the broadcast of the previous /27 (96–127)."
     ],
     "explain": "<p>The subnet is 192.168.10.128/27 (128–159).</p>"
    },
    {
     "id": "u14-B-8",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "14.3",
     "q": "<p>Predict the exact output.</p>",
     "code": "import ipaddress\nnets = ipaddress.ip_network('10.0.0.0/24').subnets(new_prefix=26)\nprint(*[n.broadcast_address for n in nets])",
     "answer": "10.0.0.63 10.0.0.127 10.0.0.191 10.0.0.255",
     "runCheck": true,
     "explain": "<p>Broadcasts of the four /26 subnets (SL-L14 p8).</p>"
    }
   ]
  },
  {
   "id": "14-C",
   "title": "Public vs Private Subnets and the 3-Tier × 2-AZ VPC",
   "badge": "class",
   "source": "SL-L14 p9–14; AWS VPC User Guide (route tables, NAT gateways)",
   "covers": [
    "14.4",
    "14.5"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "Lobby and back office",
     "html": "<p><b>Analogy (SL-L14 p13, \"Public entry, private data\").</b> A bank has a public lobby with a door to the street and back offices with no street door at all. Customers reach the vault only through the lobby staff.</p><p><b>Definition (SL-L14 p10; AWS VPC User Guide).</b> A subnet is <b>public</b> if its <b>route table</b> sends 0.0.0.0/0 to an <b>Internet Gateway (IGW)</b>. It is <b>private</b> if it has no such route. Nothing about the subnet's CIDR makes it public; only its route table does. A private subnet that must reach the Internet <i>outbound</i> (updates, APIs) routes 0.0.0.0/0 to a <b>NAT gateway</b> that sits in a <b>public</b> subnet. Inbound connections from the Internet still cannot start a session to it. A public subnet's instances also need a public IPv4 address (or an Elastic IP) to be reachable.</p>"
    },
    {
     "type": "callout",
     "kind": "slidefix",
     "title": "SL-L14 p10–12: private route tables have no NAT route",
     "html": "<p><b>Slides show:</b> p11 says \"Private Subnet → Route Table → NAT → Internet\", but the private route tables drawn on p10 and p12 contain only <code>10.0.0.0/16 → local</code>.</p><p><b>Correct:</b> with only the local route, a private instance cannot reach the Internet at all. For outbound access the private route table needs <b><code>0.0.0.0/0 → nat-gateway-id</code></b>, and the NAT gateway must live in a public subnet whose own table has <code>0.0.0.0/0 → igw</code> (as SL-L15 p24–26 shows). A database tier may deliberately keep only the local route if it never needs outbound traffic.</p>"
    },
    {
     "type": "figure",
     "caption": "3-tier × 2-AZ VPC (SL-L14 p12–14 combined): web tier in public subnets behind the IGW, app and DB tiers in private subnets, every tier repeated in two Availability Zones, one NAT gateway per AZ. Dashed blue: app traffic leaving through its AZ's NAT gateway.",
     "html": "<svg viewBox='0 0 720 560' width='100%' font-family='sans-serif'><ellipse cx='360' cy='24' rx='70' ry='18' fill='none' stroke='var(--muted)' stroke-width='2'/><text x='360' y='29' text-anchor='middle' fill='currentColor' font-size='13'>Internet</text><line x1='360' y1='42' x2='360' y2='62' stroke='currentColor' stroke-width='2'/><rect x='300' y='62' width='120' height='28' rx='6' fill='var(--warn)' fill-opacity='0.2' stroke='var(--warn)'/><text x='360' y='81' text-anchor='middle' fill='currentColor' font-size='12'>Internet Gateway</text><rect x='10' y='100' width='700' height='330' rx='12' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='22' y='120' fill='currentColor' font-size='13' font-weight='bold'>VPC 10.0.0.0/16</text><rect x='22' y='128' width='330' height='292' rx='10' fill='none' stroke='var(--muted)' stroke-dasharray='3 3'/><text x='32' y='146' fill='var(--muted)' font-size='12'>AZ us-east-1a</text><rect x='368' y='128' width='330' height='292' rx='10' fill='none' stroke='var(--muted)' stroke-dasharray='3 3'/><text x='378' y='146' fill='var(--muted)' font-size='12'>AZ us-east-1b</text><rect x='37' y='154' width='300' height='64' rx='8' fill='var(--ok)' fill-opacity='0.12' stroke='var(--ok)' stroke-dasharray='5 3'/><text x='47' y='172' fill='currentColor' font-size='12' font-weight='bold'>Web tier - PUBLIC</text><text x='327' y='172' text-anchor='end' fill='var(--muted)' font-size='11'>10.0.1.0/24</text><rect x='47' y='182' width='86' height='26' rx='5' fill='none' stroke='currentColor'/><text x='90' y='199' text-anchor='middle' fill='currentColor' font-size='11'>ALB node</text><rect x='143' y='182' width='86' height='26' rx='5' fill='none' stroke='currentColor'/><text x='186' y='199' text-anchor='middle' fill='currentColor' font-size='11'>EC2 web</text><rect x='239' y='182' width='86' height='26' rx='5' fill='none' stroke='currentColor'/><text x='282' y='199' text-anchor='middle' fill='currentColor' font-size='11'>NAT GW-a</text><rect x='37' y='240' width='300' height='64' rx='8' fill='var(--accent)' fill-opacity='0.12' stroke='var(--accent)' stroke-dasharray='5 3'/><text x='47' y='258' fill='currentColor' font-size='12' font-weight='bold'>App tier - PRIVATE</text><text x='327' y='258' text-anchor='end' fill='var(--muted)' font-size='11'>10.0.11.0/24</text><rect x='47' y='268' width='86' height='26' rx='5' fill='none' stroke='currentColor'/><text x='90' y='285' text-anchor='middle' fill='currentColor' font-size='11'>EC2 app</text><rect x='37' y='326' width='300' height='64' rx='8' fill='var(--bad)' fill-opacity='0.12' stroke='var(--bad)' stroke-dasharray='5 3'/><text x='47' y='344' fill='currentColor' font-size='12' font-weight='bold'>DB tier - PRIVATE</text><text x='327' y='344' text-anchor='end' fill='var(--muted)' font-size='11'>10.0.21.0/24</text><rect x='47' y='354' width='86' height='26' rx='5' fill='none' stroke='currentColor'/><text x='90' y='371' text-anchor='middle' fill='currentColor' font-size='11'>RDS primary</text><rect x='383' y='154' width='300' height='64' rx='8' fill='var(--ok)' fill-opacity='0.12' stroke='var(--ok)' stroke-dasharray='5 3'/><text x='393' y='172' fill='currentColor' font-size='12' font-weight='bold'>Web tier - PUBLIC</text><text x='673' y='172' text-anchor='end' fill='var(--muted)' font-size='11'>10.0.2.0/24</text><rect x='393' y='182' width='86' height='26' rx='5' fill='none' stroke='currentColor'/><text x='436' y='199' text-anchor='middle' fill='currentColor' font-size='11'>ALB node</text><rect x='489' y='182' width='86' height='26' rx='5' fill='none' stroke='currentColor'/><text x='532' y='199' text-anchor='middle' fill='currentColor' font-size='11'>EC2 web</text><rect x='585' y='182' width='86' height='26' rx='5' fill='none' stroke='currentColor'/><text x='628' y='199' text-anchor='middle' fill='currentColor' font-size='11'>NAT GW-b</text><rect x='383' y='240' width='300' height='64' rx='8' fill='var(--accent)' fill-opacity='0.12' stroke='var(--accent)' stroke-dasharray='5 3'/><text x='393' y='258' fill='currentColor' font-size='12' font-weight='bold'>App tier - PRIVATE</text><text x='673' y='258' text-anchor='end' fill='var(--muted)' font-size='11'>10.0.12.0/24</text><rect x='393' y='268' width='86' height='26' rx='5' fill='none' stroke='currentColor'/><text x='436' y='285' text-anchor='middle' fill='currentColor' font-size='11'>EC2 app</text><rect x='383' y='326' width='300' height='64' rx='8' fill='var(--bad)' fill-opacity='0.12' stroke='var(--bad)' stroke-dasharray='5 3'/><text x='393' y='344' fill='currentColor' font-size='12' font-weight='bold'>DB tier - PRIVATE</text><text x='673' y='344' text-anchor='end' fill='var(--muted)' font-size='11'>10.0.22.0/24</text><rect x='393' y='354' width='86' height='26' rx='5' fill='none' stroke='currentColor'/><text x='436' y='371' text-anchor='middle' fill='currentColor' font-size='11'>RDS standby</text><line x1='360' y1='90' x2='187' y2='154' stroke='var(--warn)' stroke-width='2'/><line x1='360' y1='90' x2='533' y2='154' stroke='var(--warn)' stroke-width='2'/><line x1='90' y1='240' x2='90' y2='218' stroke='currentColor' stroke-width='1.5'/><line x1='436' y1='240' x2='436' y2='218' stroke='currentColor' stroke-width='1.5'/><line x1='90' y1='326' x2='90' y2='304' stroke='currentColor' stroke-width='1.5'/><line x1='436' y1='326' x2='436' y2='304' stroke='currentColor' stroke-width='1.5'/><line x1='133' y1='254' x2='245' y2='208' stroke='var(--accent)' stroke-dasharray='4 3'/><line x1='479' y1='254' x2='591' y2='208' stroke='var(--accent)' stroke-dasharray='4 3'/><line x1='352' y1='358' x2='368' y2='358' stroke='var(--bad)' stroke-width='2'/><text x='360' y='405' text-anchor='middle' fill='var(--muted)' font-size='10'>sync</text><rect x='10' y='440' width='228' height='112' rx='8' fill='none' stroke='var(--ok)'/><text x='20' y='460' fill='currentColor' font-size='12' font-weight='bold'>rt-public (web-a, web-b)</text><text x='20' y='482' fill='currentColor' font-size='11'>10.0.0.0/16 → local</text><text x='20' y='500' fill='currentColor' font-size='11'>0.0.0.0/0 → igw</text><rect x='246' y='440' width='228' height='112' rx='8' fill='none' stroke='var(--accent)'/><text x='256' y='460' fill='currentColor' font-size='12' font-weight='bold'>rt-app-a / rt-app-b</text><text x='256' y='482' fill='currentColor' font-size='11'>10.0.0.0/16 → local</text><text x='256' y='500' fill='currentColor' font-size='11'>0.0.0.0/0 → nat-a / nat-b</text><text x='256' y='522' fill='var(--muted)' font-size='10'>(the route the slide omits, B11)</text><rect x='482' y='440' width='228' height='112' rx='8' fill='none' stroke='var(--bad)'/><text x='492' y='460' fill='currentColor' font-size='12' font-weight='bold'>rt-db</text><text x='492' y='482' fill='currentColor' font-size='11'>10.0.0.0/16 → local</text><text x='492' y='500' fill='currentColor' font-size='11'>0.0.0.0/0 → nat (only if DB</text><text x='492' y='516' fill='currentColor' font-size='11'>needs outbound patches)</text></svg>"
    },
    {
     "type": "table",
     "head": [
      "Tier",
      "Subnet (AZ a / AZ b)",
      "Type",
      "Route table",
      "Who may talk to it"
     ],
     "rows": [
      [
       "Web (ALB + web EC2)",
       "10.0.1.0/24 / 10.0.2.0/24",
       "Public",
       "10.0.0.0/16 → local; 0.0.0.0/0 → igw",
       "Internet on 80/443"
      ],
      [
       "App (application servers)",
       "10.0.11.0/24 / 10.0.12.0/24",
       "Private",
       "10.0.0.0/16 → local; 0.0.0.0/0 → nat (same AZ)",
       "Web tier only"
      ],
      [
       "Database (RDS)",
       "10.0.21.0/24 / 10.0.22.0/24",
       "Private",
       "10.0.0.0/16 → local (no default route)",
       "App tier only, on the DB port"
      ]
     ],
     "caption": "SL-L14 p12 used one AZ (10.0.1.0/24, 10.0.2.0/24, 10.0.3.0/24); here each tier gets one /24 per AZ, as p14 recommends."
    },
    {
     "type": "derivation",
     "title": "Address budget of the plan",
     "steps": [
      {
       "tex": "3 \\text{ tiers} \\times 2 \\text{ AZs} = 6 \\text{ subnets}",
       "why": "Every tier is repeated in each AZ for availability (SL-L14 p14)."
      },
      {
       "tex": "6 \\times 2^{8} = 1536 \\text{ addresses}",
       "why": "Six /24 subnets."
      },
      {
       "tex": "1536 / 65{,}536 \\approx 2.3\\%",
       "why": "The /16 VPC has plenty of room for more subnets later."
      },
      {
       "tex": "6 \\times (256 - 5) = 1506 \\text{ usable}",
       "why": "AWS reserves 5 addresses in each subnet."
      }
     ]
    },
    {
     "type": "cheat",
     "title": "VPC routing in five lines",
     "items": [
      "Public subnet = route table has 0.0.0.0/0 → igw",
      "Private subnet = no route to igw (optionally 0.0.0.0/0 → nat)",
      "NAT gateway lives in a public subnet; one per AZ for resilience",
      "Every route table has the implicit local route for the VPC CIDR",
      "Subnets with no explicit association use the VPC's main route table",
      "Repeat tiers across at least 2 AZs (SL-L14 p14)"
     ]
    },
    {
     "type": "worked",
     "title": "Following a packet out of a private app server",
     "tag": "University-Midsem-style",
     "problem": "<p>The app server 10.0.11.25 in app-a needs to download a patch from 52.95.110.1. Trace the routing decisions in the 3-tier VPC above.</p>",
     "steps": [
      {
       "text": "rt-app-a has two routes: 10.0.0.0/16 → local and 0.0.0.0/0 → nat-a.",
       "why": "These are the only entries to compare."
      },
      {
       "tex": "52.95.110.1 \\notin 10.0.0.0/16",
       "why": "52.x does not match the local route, so only the default route remains (longest-prefix matching itself is Unit 15)."
      },
      {
       "text": "The packet goes to NAT GW-a in public subnet web-a (10.0.1.0/24).",
       "why": "The default route's target."
      },
      {
       "text": "NAT GW-a rewrites the source 10.0.11.25 to its Elastic IP and sends the packet out using rt-public: 0.0.0.0/0 → igw.",
       "why": "NAT gateways sit in public subnets precisely so they can use the IGW."
      },
      {
       "text": "The reply returns to the Elastic IP, NAT GW-a translates it back to 10.0.11.25, and the local route delivers it.",
       "why": "Return traffic is allowed because the session was started from inside."
      }
     ],
     "answer": "<b>app-a → (0.0.0.0/0) → NAT GW-a in web-a → (0.0.0.0/0) → IGW → Internet</b>; without the NAT route (the slide's p12 table) the packet would be dropped."
    },
    {
     "type": "code",
     "file": "Unit14_vpc_planner.py",
     "level": "high",
     "title": "VPC planner: the 3-tier × 2-AZ plan validated with ipaddress"
    },
    {
     "type": "traps",
     "items": [
      "A subnet is public because of its <b>route table</b>, not its CIDR or its name.",
      "The NAT gateway goes in the <b>public</b> subnet, not the private one.",
      "An instance in a public subnet without a public IPv4 or Elastic IP still cannot be reached from the Internet.",
      "NAT lets private instances <b>start</b> outbound connections; it does not allow inbound ones.",
      "One AZ is a single point of failure; repeat each tier in at least two AZs."
     ]
    }
   ],
   "practice": [
    {
     "id": "u14-C-1",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "14.4",
     "q": "<p>What makes an AWS subnet a <b>public</b> subnet?</p>",
     "options": [
      "Its CIDR is outside the RFC 1918 ranges",
      "Its route table has 0.0.0.0/0 → Internet Gateway",
      "It contains a NAT gateway",
      "It is named \"public\""
     ],
     "answer": 1,
     "why": [
      "VPC subnets normally use private CIDRs; that is not the test.",
      "SL-L14 p10: the IGW route is the definition.",
      "A NAT gateway sits in a public subnet but does not make it public.",
      "Names are labels only."
     ],
     "explain": "<p>The <b>route to the IGW</b>.</p>"
    },
    {
     "id": "u14-C-2",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "14.4",
     "q": "<p>Instances in a private subnet must download OS updates. Where is the NAT gateway created?</p>",
     "options": [
      "In the private subnet itself",
      "In a public subnet, with the private route table pointing 0.0.0.0/0 to it",
      "Attached directly to the VPC like an IGW",
      "Inside the Internet Gateway"
     ],
     "answer": 1,
     "why": [
      "It would have no path to the IGW.",
      "The NAT gateway needs the public subnet's IGW route; the private table targets it.",
      "That describes an Internet Gateway, not a NAT gateway.",
      "They are separate resources."
     ],
     "explain": "<p>Public subnet + private route 0.0.0.0/0 → nat.</p>"
    },
    {
     "id": "u14-C-3",
     "type": "msq",
     "tag": "University-Midsem-style",
     "topic": "14.4",
     "q": "<p>Select ALL that are required for you to SSH from home into an EC2 instance in a custom VPC.</p>",
     "options": [
      "An Internet Gateway attached to the VPC",
      "The instance's subnet route table has 0.0.0.0/0 → igw",
      "The instance has a public IPv4 or Elastic IP",
      "The security group allows inbound TCP 22 from your IP",
      "A NAT gateway in the instance's subnet"
     ],
     "answer": [
      0,
      1,
      2,
      3
     ],
     "why": [
      "No IGW, no path to the Internet.",
      "Otherwise the subnet is private.",
      "Private 10.x addresses are not routable from home.",
      "The firewall must allow the connection.",
      "NAT is for outbound-only traffic from private subnets."
     ],
     "explain": "<p>The first four (exactly what Lab A4 grades).</p>"
    },
    {
     "id": "u14-C-4",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "14.5",
     "q": "<p>A 3-tier architecture (web, app, DB) is deployed across 2 Availability Zones with one subnet per tier per AZ. How many subnets are needed? (integer)</p>",
     "answer": 6,
     "tol": 0,
     "unit": "subnets",
     "verify": "3*2",
     "steps": [
      {
       "tex": "3 \\times 2 = 6",
       "why": "Each tier is repeated in each AZ."
      }
     ],
     "explain": "<p><b>6</b>.</p>"
    },
    {
     "id": "u14-C-5",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "14.5",
     "q": "<p>Those 6 subnets are all /24s in AWS. How many usable addresses do they give in total? (integer)</p>",
     "answer": 1506,
     "tol": 0,
     "unit": "addresses",
     "verify": "6*(2**8-5)",
     "steps": [
      {
       "tex": "2^{8} - 5 = 251",
       "why": "AWS usable per /24."
      },
      {
       "tex": "6 \\times 251 = 1506",
       "why": "Six subnets."
      }
     ],
     "explain": "<p><b>1,506</b>.</p>"
    },
    {
     "id": "u14-C-6",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "14.5",
     "q": "<p>In the 3-tier design, which tier is placed in a public subnet?</p>",
     "options": [
      "Database tier",
      "Application tier",
      "Web tier (load balancer / web servers)",
      "All three, protected by security groups"
     ],
     "answer": 2,
     "why": [
      "The DB holds the data and must be private (SL-L14 p13).",
      "Business logic stays private.",
      "Public entry point (SL-L14 p12).",
      "That throws away the isolation the design exists for."
     ],
     "explain": "<p><b>Web tier</b>: public entry, private data.</p>"
    },
    {
     "id": "u14-C-7",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "14.4",
     "q": "<p>SL-L14 p12's private route tables contain only <code>10.0.0.0/16 → local</code>. What can an app server there do?</p>",
     "options": [
      "Reach the Internet through NAT",
      "Reach other subnets in the VPC but not the Internet",
      "Reach nothing at all",
      "Receive inbound connections from the Internet"
     ],
     "answer": 1,
     "why": [
      "There is no NAT route in that table (slide fix B11).",
      "The local route covers the whole VPC; nothing else matches.",
      "The local route still works.",
      "No IGW route and no public IP."
     ],
     "explain": "<p>Only VPC-internal traffic.</p>"
    }
   ]
  },
  {
   "id": "14-D",
   "title": "The AWS Reality: 5 Reserved Addresses, /16–/28 Limits, Design Rules",
   "badge": "class",
   "source": "SL-L14 p15–20; AWS VPC User Guide (subnet sizing)",
   "covers": [
    "14.6",
    "14.7",
    "14.8"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "Five rooms taken by the building's services",
     "html": "<p><b>Analogy.</b> In every AWS subnet, the building manager keeps five rooms: the address plate (network), the router's room, the DNS desk, a spare room, and the final room (broadcast). Tenants get the rest.</p><p><b>Definition (SL-L14 p16; AWS VPC User Guide).</b> AWS reserves the <b>first four</b> and the <b>last</b> address of every subnet: base (network address), base + 1 (VPC router), base + 2 (Amazon DNS resolver), base + 3 (reserved for future use) and the last address (broadcast; AWS does not support broadcast but still reserves it). So AWS usable = $2^{32-n} - 5$. Subnet and VPC IPv4 blocks must be between <b>/16 and /28</b> (p18), subnets in one VPC must <b>not overlap</b>, each must lie <b>inside</b> the VPC CIDR, and a subnet's CIDR <b>cannot be changed</b> after creation (p20).</p>"
    },
    {
     "type": "table",
     "head": [
      "Address (10.0.0.0/24)",
      "General rule",
      "Reserved for"
     ],
     "rows": [
      [
       "10.0.0.0",
       "base",
       "Network address"
      ],
      [
       "10.0.0.1",
       "base + 1",
       "VPC router"
      ],
      [
       "10.0.0.2",
       "base + 2",
       "Amazon-provided DNS"
      ],
      [
       "10.0.0.3",
       "base + 3",
       "Future use"
      ],
      [
       "10.0.0.255",
       "last address",
       "Network broadcast (reserved even though AWS has no broadcast)"
      ]
     ],
     "caption": "SL-L14 p16: traditional /24 → 254 usable; AWS /24 → 251."
    },
    {
     "type": "figure",
     "caption": "Reserved-address strip for the smallest allowed AWS subnet.",
     "html": "<svg viewBox='0 0 720 110' width='100%' font-family='sans-serif'><text x='10' y='18' fill='currentColor' font-size='13'>10.0.0.0/28 in AWS: 16 addresses, 5 reserved (red), 11 usable (.4 to .14)</text><rect x='10' y='30' width='40' height='40' rx='4' fill='var(--bad)' fill-opacity='0.2' stroke='var(--bad)'/><text x='30' y='54' text-anchor='middle' fill='currentColor' font-size='12'>.0</text><text x='30' y='88' text-anchor='middle' fill='var(--bad)' font-size='10'>net</text><rect x='54' y='30' width='40' height='40' rx='4' fill='var(--bad)' fill-opacity='0.2' stroke='var(--bad)'/><text x='74' y='54' text-anchor='middle' fill='currentColor' font-size='12'>.1</text><text x='74' y='88' text-anchor='middle' fill='var(--bad)' font-size='10'>router</text><rect x='98' y='30' width='40' height='40' rx='4' fill='var(--bad)' fill-opacity='0.2' stroke='var(--bad)'/><text x='118' y='54' text-anchor='middle' fill='currentColor' font-size='12'>.2</text><text x='118' y='88' text-anchor='middle' fill='var(--bad)' font-size='10'>DNS</text><rect x='142' y='30' width='40' height='40' rx='4' fill='var(--bad)' fill-opacity='0.2' stroke='var(--bad)'/><text x='162' y='54' text-anchor='middle' fill='currentColor' font-size='12'>.3</text><text x='162' y='88' text-anchor='middle' fill='var(--bad)' font-size='10'>future</text><rect x='186' y='30' width='40' height='40' rx='4' fill='var(--ok)' fill-opacity='0.2' stroke='var(--ok)'/><text x='206' y='54' text-anchor='middle' fill='currentColor' font-size='12'>.4</text><text x='206' y='88' text-anchor='middle' fill='var(--ok)' font-size='10'>host</text><rect x='230' y='30' width='40' height='40' rx='4' fill='var(--ok)' fill-opacity='0.2' stroke='var(--ok)'/><text x='250' y='54' text-anchor='middle' fill='currentColor' font-size='12'>.5</text><text x='250' y='88' text-anchor='middle' fill='var(--ok)' font-size='10'>host</text><rect x='274' y='30' width='40' height='40' rx='4' fill='var(--ok)' fill-opacity='0.2' stroke='var(--ok)'/><text x='294' y='54' text-anchor='middle' fill='currentColor' font-size='12'>.6</text><text x='294' y='88' text-anchor='middle' fill='var(--ok)' font-size='10'>host</text><rect x='318' y='30' width='40' height='40' rx='4' fill='var(--ok)' fill-opacity='0.2' stroke='var(--ok)'/><text x='338' y='54' text-anchor='middle' fill='currentColor' font-size='12'>.7</text><text x='338' y='88' text-anchor='middle' fill='var(--ok)' font-size='10'>host</text><rect x='362' y='30' width='40' height='40' rx='4' fill='var(--ok)' fill-opacity='0.2' stroke='var(--ok)'/><text x='382' y='54' text-anchor='middle' fill='currentColor' font-size='12'>.8</text><text x='382' y='88' text-anchor='middle' fill='var(--ok)' font-size='10'>host</text><rect x='406' y='30' width='40' height='40' rx='4' fill='var(--ok)' fill-opacity='0.2' stroke='var(--ok)'/><text x='426' y='54' text-anchor='middle' fill='currentColor' font-size='12'>.9</text><text x='426' y='88' text-anchor='middle' fill='var(--ok)' font-size='10'>host</text><rect x='450' y='30' width='40' height='40' rx='4' fill='var(--ok)' fill-opacity='0.2' stroke='var(--ok)'/><text x='470' y='54' text-anchor='middle' fill='currentColor' font-size='12'>.10</text><text x='470' y='88' text-anchor='middle' fill='var(--ok)' font-size='10'>host</text><rect x='494' y='30' width='40' height='40' rx='4' fill='var(--ok)' fill-opacity='0.2' stroke='var(--ok)'/><text x='514' y='54' text-anchor='middle' fill='currentColor' font-size='12'>.11</text><text x='514' y='88' text-anchor='middle' fill='var(--ok)' font-size='10'>host</text><rect x='538' y='30' width='40' height='40' rx='4' fill='var(--ok)' fill-opacity='0.2' stroke='var(--ok)'/><text x='558' y='54' text-anchor='middle' fill='currentColor' font-size='12'>.12</text><text x='558' y='88' text-anchor='middle' fill='var(--ok)' font-size='10'>host</text><rect x='582' y='30' width='40' height='40' rx='4' fill='var(--ok)' fill-opacity='0.2' stroke='var(--ok)'/><text x='602' y='54' text-anchor='middle' fill='currentColor' font-size='12'>.13</text><text x='602' y='88' text-anchor='middle' fill='var(--ok)' font-size='10'>host</text><rect x='626' y='30' width='40' height='40' rx='4' fill='var(--ok)' fill-opacity='0.2' stroke='var(--ok)'/><text x='646' y='54' text-anchor='middle' fill='currentColor' font-size='12'>.14</text><text x='646' y='88' text-anchor='middle' fill='var(--ok)' font-size='10'>host</text><rect x='670' y='30' width='40' height='40' rx='4' fill='var(--bad)' fill-opacity='0.2' stroke='var(--bad)'/><text x='690' y='54' text-anchor='middle' fill='currentColor' font-size='12'>.15</text><text x='690' y='88' text-anchor='middle' fill='var(--bad)' font-size='10'>bcast</text></svg>"
    },
    {
     "type": "derivation",
     "title": "AWS usable count and the overlap test",
     "steps": [
      {
       "tex": "\\text{usable}_{AWS} = 2^{32-n} - 5",
       "why": "Four at the start plus the last address."
      },
      {
       "tex": "/24: 256 - 5 = 251;\\; /20: 4096 - 5 = 4091",
       "why": "SL-L14 p16 and the console on p17."
      },
      {
       "tex": "/28: 16 - 5 = 11;\\; /16: 65{,}536 - 5 = 65{,}531",
       "why": "Smallest and largest allowed blocks."
      },
      {
       "tex": "A \\cap B \\neq \\varnothing \\iff \\text{net}_A \\wedge m_p = \\text{net}_B \\wedge m_p,\\; p = \\min(n_A, n_B)",
       "why": "CIDR blocks are either nested or disjoint, so compare both under the shorter prefix."
      },
      {
       "tex": "B \\subseteq A \\iff n_B \\ge n_A \\text{ and } \\text{net}_B \\wedge m_{n_A} = \\text{net}_A",
       "why": "Containment: B is at least as long and falls in A's range."
      }
     ]
    },
    {
     "type": "table",
     "head": [
      "Prefix",
      "Mask",
      "Total",
      "Generic usable (−2)",
      "AWS usable (−5)"
     ],
     "rows": [
      [
       "/16",
       "255.255.0.0",
       "65,536",
       "65,534",
       "<b>65,531</b>"
      ],
      [
       "/17",
       "255.255.128.0",
       "32,768",
       "32,766",
       "<b>32,763</b>"
      ],
      [
       "/18",
       "255.255.192.0",
       "16,384",
       "16,382",
       "<b>16,379</b>"
      ],
      [
       "/19",
       "255.255.224.0",
       "8,192",
       "8,190",
       "<b>8,187</b>"
      ],
      [
       "/20",
       "255.255.240.0",
       "4,096",
       "4,094",
       "<b>4,091</b>"
      ],
      [
       "/21",
       "255.255.248.0",
       "2,048",
       "2,046",
       "<b>2,043</b>"
      ],
      [
       "/22",
       "255.255.252.0",
       "1,024",
       "1,022",
       "<b>1,019</b>"
      ],
      [
       "/23",
       "255.255.254.0",
       "512",
       "510",
       "<b>507</b>"
      ],
      [
       "/24",
       "255.255.255.0",
       "256",
       "254",
       "<b>251</b>"
      ],
      [
       "/25",
       "255.255.255.128",
       "128",
       "126",
       "<b>123</b>"
      ],
      [
       "/26",
       "255.255.255.192",
       "64",
       "62",
       "<b>59</b>"
      ],
      [
       "/27",
       "255.255.255.224",
       "32",
       "30",
       "<b>27</b>"
      ],
      [
       "/28",
       "255.255.255.240",
       "16",
       "14",
       "<b>11</b>"
      ]
     ],
     "caption": "Every prefix AWS accepts (/16 to /28). /29 and longer are rejected."
    },
    {
     "type": "callout",
     "kind": "aws",
     "title": "Console demos (SL-L14 p17–19)",
     "html": "<p>p17: subnet <code>CN-Lab-VPC-subnet-private2-us-east-1b</code>, 10.0.144.0/20, <b>Available IPv4 addresses 4091</b>. p18: Create subnet 10.0.32.0/29 (\"8 IPs\") fails with <code>IPv4 block sizes must be between a /16 netmask and /28 netmask.</code> p19: 10.0.32.0/26 (\"64 IPs\") is accepted.</p>"
    },
    {
     "type": "table",
     "head": [
      "Rule (SL-L14 p20)",
      "Example in VPC 10.0.0.0/16",
      "Verdict"
     ],
     "rows": [
      [
       "1. No overlap",
       "A 10.0.1.0/24 and B 10.0.1.128/25",
       "✗ B lies inside A (10.0.1.128–255)"
      ],
      [
       "2. Must fit inside the VPC",
       "10.0.2.0/24 vs 10.1.0.0/16",
       "✓ first, ✗ second (outside 10.0.0.0/16)"
      ],
      [
       "3. Size is fixed after creation",
       "10.0.1.0/24 → 10.0.1.0/26",
       "✗ not allowed"
      ],
      [
       "4. Wrong size? New subnet + migrate",
       "old 10.0.1.0/24 → new 10.0.2.0/24",
       "move EC2, databases and other resources, then delete the old one"
      ]
     ],
     "caption": "Plan the size up front."
    },
    {
     "type": "cheat",
     "title": "AWS subnet facts",
     "items": [
      "Usable = $2^{32-n} - 5$: /28 → 11, /26 → 59, /24 → 251, /20 → 4091, /16 → 65,531",
      "Reserved: .0 network, .1 router, .2 DNS, .3 future, last = broadcast",
      "Allowed sizes: /16 (largest) to /28 (smallest)",
      "No overlaps; inside the VPC CIDR; size immutable",
      "Size for N instances: smallest $h$ with $2^{h} - 5 \\ge N$"
     ]
    },
    {
     "type": "worked",
     "title": "Which subnets will AWS accept?",
     "tag": "University-Midsem-style",
     "problem": "<p>VPC 10.0.0.0/16 already has subnet A = 10.0.1.0/24. Check B = 10.0.1.128/25, C = 10.1.0.0/16, D = 10.0.32.0/29 and E = 10.0.32.0/26. For each accepted one give its AWS usable count.</p>",
     "steps": [
      {
       "tex": "B: p = \\min(24, 25) = 24;\\; 10.0.1.128 \\wedge /24 = 10.0.1.0 = A",
       "why": "Same network under the shorter prefix, so B overlaps A: rejected."
      },
      {
       "tex": "C: 10.1.0.0 \\wedge /16 = 10.1.0.0 \\neq 10.0.0.0",
       "why": "Not inside the VPC: rejected."
      },
      {
       "tex": "D: /29 > /28",
       "why": "Too small; the console error on SL-L14 p18: rejected."
      },
      {
       "tex": "E: /26 \\in [16, 28],\\; 10.0.32.0 \\wedge /16 = 10.0.0.0",
       "why": "Inside the VPC, allowed size."
      },
      {
       "tex": "E \\text{ vs } A: 10.0.32.0 \\wedge /24 = 10.0.32.0 \\neq 10.0.1.0",
       "why": "No overlap with A."
      },
      {
       "tex": "2^{6} - 5 = 59",
       "why": "E's AWS usable count."
      }
     ],
     "answer": "<b>Only E (10.0.32.0/26) is accepted, with 59 usable addresses.</b> B overlaps, C is outside, D is too small."
    },
    {
     "type": "code",
     "file": "Unit14_vpc_planner.py",
     "level": "high",
     "title": "validate(): /16–/28, subnet_of(), overlaps(), usable = num_addresses − 5"
    },
    {
     "type": "code",
     "file": "Unit14_subnet_vlsm_bitwise.py",
     "level": "low",
     "title": "overlaps() and contains() with masks only"
    },
    {
     "type": "traps",
     "items": [
      "\"Usable in AWS\" is −5, not −2: /24 is 251.",
      "The DNS address is base + 2 of <b>each subnet</b> (10.0.32.2 for 10.0.32.0/26), and the VPC resolver also answers at VPC base + 2.",
      "/29 and /30 are fine in classic networking (point-to-point links) but rejected by AWS.",
      "10.0.1.128/25 and 10.0.1.0/24 overlap even though their network addresses differ.",
      "You cannot resize a subnet; create a new one and migrate."
     ]
    }
   ],
   "practice": [
    {
     "id": "u14-D-1",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "14.6",
     "q": "<p>How many usable IPv4 addresses does an AWS /24 subnet provide? (integer)</p>",
     "answer": 251,
     "tol": 0,
     "unit": "addresses",
     "verify": "2**8-5",
     "steps": [
      {
       "tex": "2^{8} = 256",
       "why": "Total."
      },
      {
       "tex": "256 - 5 = 251",
       "why": "AWS reserves 5."
      }
     ],
     "explain": "<p><b>251</b>.</p>"
    },
    {
     "id": "u14-D-2",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "14.7",
     "q": "<p>How many usable addresses does the <b>smallest</b> subnet AWS allows provide? (integer)</p>",
     "answer": 11,
     "tol": 0,
     "unit": "addresses",
     "verify": "2**(32-28)-5",
     "steps": [
      {
       "tex": "\\text{smallest} = /28",
       "why": "AWS limit (SL-L14 p18)."
      },
      {
       "tex": "2^{4} - 5 = 11",
       "why": "16 minus 5 reserved."
      }
     ],
     "explain": "<p><b>11</b>.</p>"
    },
    {
     "id": "u14-D-3",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "14.6",
     "q": "<p>Which address does AWS reserve for the Amazon DNS resolver in subnet 10.0.32.0/26?</p>",
     "answer": "10.0.32.2",
     "verify": "'10.0.32.' + str(0 + 2)",
     "steps": [
      {
       "tex": "\\text{base} + 2",
       "why": "Third address of the subnet."
      }
     ],
     "explain": "<p>Base + 2: <b>10.0.32.2</b>.</p>"
    },
    {
     "id": "u14-D-4",
     "type": "text",
     "tag": "GATE-style",
     "topic": "14.6",
     "q": "<p>What is the last reserved address (broadcast) of subnet 10.0.144.0/20?</p>",
     "answer": "10.0.159.255",
     "verify": "'10.0.' + str(144 + 16 - 1) + '.255'",
     "steps": [
      {
       "tex": "M = 256 - 240 = 16",
       "why": "Third-octet block."
      },
      {
       "tex": "144 + 16 - 1 = 159",
       "why": "Last third-octet value."
      },
      {
       "tex": "\\text{octet 4} = 255",
       "why": "All host bits 1."
      }
     ],
     "explain": "<p>/20 covers 16 values of the third octet: 144 to 159. Last address <b>10.0.159.255</b>.</p>"
    },
    {
     "id": "u14-D-5",
     "type": "mcq",
     "tag": "GATE-style",
     "topic": "14.8",
     "q": "<p>VPC 10.0.0.0/16 already contains subnet 10.0.0.0/20. Which new subnet will AWS accept?</p>",
     "options": [
      "10.0.8.0/24",
      "10.0.16.0/24",
      "10.0.15.0/24",
      "10.1.0.0/24"
     ],
     "answer": 1,
     "why": [
      "10.0.0.0/20 covers 10.0.0.0–10.0.15.255; 8 is inside: overlap.",
      "16 is the first value after the /20: no overlap, inside the VPC.",
      "15 is the last block of the /20: overlap.",
      "Outside the VPC CIDR."
     ],
     "explain": "<p><b>10.0.16.0/24</b>.</p>"
    },
    {
     "id": "u14-D-6",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "14.7",
     "q": "<p>You try to create subnet 10.0.32.0/29 in the AWS console. What happens?</p>",
     "options": [
      "It is created with 3 usable addresses",
      "It is created with 6 usable addresses",
      "It is rejected: block sizes must be between /16 and /28",
      "It is created but cannot host EC2"
     ],
     "answer": 2,
     "why": [
      "8 − 5 = 3 would be the arithmetic, but AWS refuses the size.",
      "That is the generic count; AWS refuses the size.",
      "Exact console error on SL-L14 p18.",
      "It is never created."
     ],
     "explain": "<p>Rejected.</p>"
    },
    {
     "id": "u14-D-7",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "14.8",
     "q": "<p>How many non-overlapping /24 subnets can a /16 VPC hold at most? (integer)</p>",
     "answer": 256,
     "tol": 0,
     "unit": "subnets",
     "verify": "2**(24-16)",
     "steps": [
      {
       "tex": "24 - 16 = 8",
       "why": "Extra bits."
      },
      {
       "tex": "2^{8} = 256",
       "why": "Subnets."
      }
     ],
     "explain": "<p><b>256</b>.</p>"
    },
    {
     "id": "u14-D-8",
     "type": "msq",
     "tag": "University-Midsem-style",
     "topic": "14.8",
     "q": "<p>Select ALL true statements about AWS VPC subnets.</p>",
     "options": [
      "Two subnets in the same VPC may not overlap",
      "A subnet's CIDR can be enlarged later from the console",
      "Every subnet must lie inside the VPC CIDR",
      "AWS reserves base + 1 for the VPC router",
      "A /30 subnet is allowed for point-to-point links"
     ],
     "answer": [
      0,
      2,
      3
     ],
     "why": [
      "SL-L14 p20 rule 1.",
      "Size is fixed; create a new subnet and migrate (rule 3 and 4).",
      "Rule 2.",
      "SL-L14 p16.",
      "Smallest allowed is /28."
     ],
     "explain": "<p>1, 3 and 4.</p>"
    },
    {
     "id": "u14-D-9",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "14.8",
     "q": "<p>Predict the exact output.</p>",
     "code": "import ipaddress\na = ipaddress.ip_network('10.0.1.0/24')\nprint(a.overlaps(ipaddress.ip_network('10.0.1.128/25')), a.overlaps(ipaddress.ip_network('10.0.2.0/24')))",
     "answer": "True False",
     "runCheck": true,
     "explain": "<p>10.0.1.128/25 lies inside 10.0.1.0/24 (overlap); 10.0.2.0/24 is a different block.</p>"
    },
    {
     "id": "u14-D-10",
     "type": "write",
     "tag": "University-Midsem-style",
     "topic": "14.8",
     "q": "<p>Write <code>validate(vpc_cidr, subnets)</code> using <code>ipaddress</code> that returns a list of problems: prefix outside /16–/28, subnet outside the VPC, overlapping subnets, host bits set.</p>",
     "starter": "import ipaddress\n\ndef validate(vpc_cidr, subnets):\n    problems = []\n    # subnets: list of dicts with 'name' and 'cidr'\n    return problems\n",
     "solutionFile": "Unit14_vpc_planner.py",
     "rubric": [
      "Parses with strict <code>ip_network</code> and reports the ValueError for host bits",
      "Checks <code>16 &lt;= prefixlen &lt;= 28</code>",
      "Uses <code>subnet_of(vpc)</code> for containment",
      "Checks every pair with <code>overlaps()</code>",
      "Accepts the 3-tier × 2-AZ plan with no problems"
     ],
     "explain": "<p>See <code>validate</code> in the model solution.</p>"
    }
   ]
  },
  {
   "id": "14-E",
   "title": "Labs: Custom VPC 10.20.0.0/16 + IGW + rt-public; Security Group web-sg",
   "badge": "lab",
   "source": "Study Pack labs A4 (\"Csai321-vpc-reach\", 03 Sep 2026) and A3 (\"Sample of Contest\", 01 Sep 2026); phase0/inventory/STUDYPACK-labs.md A3, A4",
   "covers": [
    "15.14"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "What the grader is really checking",
     "html": "<p><b>Idea.</b> Both labs test the same chain you met in 14-C: <i>an instance is reachable only if every link is present</i>: IGW attached → route 0.0.0.0/0 → igw in the subnet's route table → public IPv4 on the instance → security group allowing the port. Miss one link and the SSH or HTTP attempt times out.</p><p><b>Security groups (AWS EC2 User Guide).</b> A security group is a <b>stateful</b> firewall attached to an instance's network interface: you write <b>allow</b> rules only; return traffic for an allowed connection is automatically allowed. A newly created security group has <b>no inbound rules</b> and <b>one outbound rule</b> allowing all traffic.</p>"
    },
    {
     "type": "figure",
     "caption": "Lab A4 target state: only subnet-a is associated with rt-public, so only subnet-a is public.",
     "html": "<svg viewBox='0 0 720 250' width='100%' font-family='sans-serif'><ellipse cx='620' cy='40' rx='70' ry='20' fill='none' stroke='var(--muted)' stroke-width='2'/><text x='620' y='45' text-anchor='middle' fill='currentColor' font-size='13'>Internet</text><rect x='10' y='10' width='500' height='230' rx='12' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='22' y='32' fill='currentColor' font-size='13' font-weight='bold'>vpc-lab 10.20.0.0/16</text><rect x='470' y='60' width='80' height='30' rx='6' fill='var(--warn)' fill-opacity='0.2' stroke='var(--warn)'/><text x='510' y='80' text-anchor='middle' fill='currentColor' font-size='12'>igw-lab</text><line x1='550' y1='70' x2='585' y2='52' stroke='var(--warn)' stroke-width='2'/><rect x='25' y='45' width='230' height='120' rx='8' fill='var(--ok)' fill-opacity='0.1' stroke='var(--ok)'/><text x='35' y='65' fill='currentColor' font-size='12' font-weight='bold'>subnet-a 10.20.1.0/24</text><text x='35' y='82' fill='var(--muted)' font-size='11'>us-east-1a, auto-assign public IPv4 ON</text><rect x='45' y='95' width='190' height='55' rx='6' fill='none' stroke='currentColor'/><text x='140' y='115' text-anchor='middle' fill='currentColor' font-size='12'>ec2-lab (t3.micro)</text><text x='140' y='132' text-anchor='middle' fill='var(--muted)' font-size='11'>10.20.1.x + public IPv4</text><text x='140' y='146' text-anchor='middle' fill='var(--muted)' font-size='11'>SG admin-sg: TCP 22 from My IP/32</text><rect x='270' y='45' width='190' height='120' rx='8' fill='var(--muted)' fill-opacity='0.08' stroke='var(--muted)'/><text x='280' y='65' fill='currentColor' font-size='12' font-weight='bold'>subnet-b 10.20.2.0/24</text><text x='280' y='82' fill='var(--muted)' font-size='11'>us-east-1b, auto-assign OFF</text><text x='280' y='100' fill='var(--muted)' font-size='11'>empty (proves 2 AZs)</text><rect x='25' y='175' width='230' height='55' rx='6' fill='none' stroke='var(--ok)'/><text x='35' y='194' fill='currentColor' font-size='12' font-weight='bold'>rt-public (assoc: subnet-a)</text><text x='35' y='211' fill='currentColor' font-size='11'>10.20.0.0/16 → local</text><text x='35' y='225' fill='currentColor' font-size='11'>0.0.0.0/0 → igw-lab</text><rect x='270' y='175' width='190' height='55' rx='6' fill='none' stroke='var(--muted)'/><text x='280' y='194' fill='currentColor' font-size='12' font-weight='bold'>main route table</text><text x='280' y='211' fill='currentColor' font-size='11'>10.20.0.0/16 → local only</text><text x='280' y='225' fill='var(--muted)' font-size='11'>(subnet-b, implicitly)</text><line x1='255' y1='200' x2='470' y2='80' stroke='var(--ok)' stroke-dasharray='4 3'/></svg>"
    },
    {
     "type": "table",
     "head": [
      "Part (marks)",
      "Build step",
      "Value / check"
     ],
     "rows": [
      [
       "A (7)",
       "Create VPC <code>vpc-lab</code>",
       "IPv4 CIDR 10.20.0.0/16, no IPv6, default tenancy"
      ],
      [
       "A",
       "Subnet <code>subnet-a</code>",
       "10.20.1.0/24, us-east-1a, Auto-assign public IPv4 = Enable (Actions → Edit subnet settings)"
      ],
      [
       "A",
       "Subnet <code>subnet-b</code>",
       "10.20.2.0/24, us-east-1b, auto-assign left disabled, stays empty"
      ],
      [
       "B (4)",
       "1. Internet gateways → Create <code>igw-lab</code>",
       ""
      ],
      [
       "B",
       "2. Actions → Attach to VPC → vpc-lab",
       "a detached IGW routes nothing"
      ],
      [
       "B",
       "3. Route tables → Create <code>rt-public</code> in vpc-lab",
       ""
      ],
      [
       "B",
       "4. Routes → Edit routes → add 0.0.0.0/0 → igw-lab",
       "the public route"
      ],
      [
       "B",
       "5. Subnet associations → tick subnet-a only",
       "subnet-b stays on the main route table (private)"
      ],
      [
       "C (3)",
       "SG <code>admin-sg</code>, \"csai321 admin access\"",
       "exactly one inbound rule: SSH TCP 22 from My IP (/32)"
      ],
      [
       "D (5)",
       "EC2 <code>ec2-lab</code>: Amazon Linux 2023, t3.micro, key-lab (RSA .pem), subnet-a, public IP on, admin-sg",
       "running; private 10.20.1.x plus a public IPv4"
      ],
      [
       "E (1)",
       "Tag <code>csai321:hosts</code> on the VPC",
       "usable hosts in 10.20.1.0/24 (see the callout)"
      ],
      [
       "all",
       "Tag <code>csai321:lab = vpc-reach</code>",
       "VPC, both subnets, IGW, route table, SG, EC2: the route table is the one people forget"
      ]
     ],
     "caption": "Lab A4 \"Build a Custom VPC and a Reachable Instance Inside It\" (30 min, 20 marks, us-east-1)."
    },
    {
     "type": "table",
     "head": [
      "#",
      "Type",
      "Protocol",
      "Port",
      "Source"
     ],
     "rows": [
      [
       "1",
       "SSH",
       "TCP",
       "22",
       "My IP (a single /32)"
      ],
      [
       "2",
       "HTTP",
       "TCP",
       "80",
       "0.0.0.0/0 (Anywhere-IPv4)"
      ],
      [
       "3",
       "HTTPS",
       "TCP",
       "443",
       "0.0.0.0/0 (Anywhere-IPv4)"
      ]
     ],
     "caption": "Lab A3: security group <code>web-sg</code> (description \"csai321 public web server\", default VPC). Exactly three inbound rules; outbound left at the default allow-all. Then launch <code>web-server</code> (Amazon Linux 2023, t3.micro, public IP enabled, SG web-sg). Tag <code>csai321:lab = ec2-firewall</code> on both the SG and the instance."
    },
    {
     "type": "callout",
     "kind": "key",
     "title": "The two concept-tag answers",
     "html": "<p><b>csai321:defaultrules</b> (Lab A3) asks for the number of <b>inbound</b> rules in a brand-new security group: <b>0</b>. A new SG denies all inbound traffic until you add rules, and has one outbound allow-all rule. (The VPC's <i>default</i> security group is different: it allows inbound traffic from itself.)</p><p><b>csai321:hosts</b> (Lab A4) asks for the usable host addresses in 10.20.1.0/24. The source does not state the expected value. The generic answer is $2^8 - 2 = 254$; inside AWS the answer is $2^8 - 5 = 251$ (what the console shows as available). Because the lab is an AWS lab, 251 is the AWS-correct value. In an exam, read whether the question says \"in AWS\".</p>"
    },
    {
     "type": "callout",
     "kind": "aws",
     "title": "Naming and scoring details",
     "html": "<p>Security-group names may not start with <code>sg-</code> (AWS reserves the prefix for IDs), so the lab uses <code>web-sg</code>, not <code>sg-web</code>; the name cannot be changed later. SSH open to 0.0.0.0/0 scores zero for that item; adding an Anywhere-IPv6 rule counts as a fourth rule. Self-check from your laptop: <code>chmod 400 key-lab.pem</code> then <code>ssh -i key-lab.pem ec2-user@&lt;PUBLIC_IPv4&gt;</code>. \"If it fails, the cause is almost always the route table association or a missing public IP.\"</p>"
    },
    {
     "type": "derivation",
     "title": "Numbers behind the lab",
     "steps": [
      {
       "tex": "10.20.1.0/24:\\; 2^{8} = 256 \\text{ addresses}",
       "why": "24-bit prefix, 8 host bits."
      },
      {
       "tex": "\\text{generic} = 256 - 2 = 254",
       "why": "Classic rule."
      },
      {
       "tex": "\\text{AWS} = 256 - 5 = 251",
       "why": "10.20.1.0, .1, .2, .3 and .255 are reserved."
      },
      {
       "tex": "\\text{ec2-lab private IP} \\in [10.20.1.4,\\; 10.20.1.254]",
       "why": "The first assignable address in an AWS subnet is base + 4."
      },
      {
       "tex": "\\text{My IP} = a.b.c.d/32 \\Rightarrow 2^{0} = 1 \\text{ address}",
       "why": "A /32 source allows exactly one client address; 0.0.0.0/0 allows all $2^{32}$."
      }
     ]
    },
    {
     "type": "cheat",
     "title": "Lab checklist",
     "items": [
      "IGW created <b>and attached</b>",
      "rt-public: 0.0.0.0/0 → igw-lab, associated with subnet-a only",
      "Auto-assign public IPv4 on subnet-a (or at launch)",
      "SG: 22 from My IP/32; 80 and 443 from 0.0.0.0/0 for a web server",
      "New SG: 0 inbound, 1 outbound (allow all); SGs are stateful",
      "Tag every resource the grader lists"
     ]
    },
    {
     "type": "worked",
     "title": "\"SSH to ec2-lab times out\": debug in order",
     "tag": "University-Midsem-style",
     "problem": "<p>After building Lab A4, <code>ssh -i key-lab.pem ec2-user@&lt;PUBLIC_IPv4&gt;</code> hangs until it times out. List the checks in the order the packet meets them and say what each fixes.</p>",
     "steps": [
      {
       "text": "1. Does the instance have a public IPv4? If not, enable auto-assign on subnet-a or attach an Elastic IP.",
       "why": "Without one, there is no address to reach from home."
      },
      {
       "text": "2. Is igw-lab attached to vpc-lab?",
       "why": "A detached gateway carries no traffic."
      },
      {
       "text": "3. Does rt-public contain 0.0.0.0/0 → igw-lab, and is subnet-a associated with rt-public (not the main table)?",
       "why": "The grader's note: \"a subnet whose routing cannot be seen reads as private\"."
      },
      {
       "text": "4. Does admin-sg allow TCP 22 from your current public IP /32?",
       "why": "Your home IP may have changed since you created the rule (\"My IP\" is a snapshot)."
      },
      {
       "text": "5. Only if the connection is <i>refused</i> or rejected rather than timing out: check <code>chmod 400</code> on the key and the user name ec2-user.",
       "why": "A timeout is a network-path problem; a permission error is a key problem."
      }
     ],
     "answer": "<b>Public IP → IGW attached → route 0.0.0.0/0 → igw + association → SG port 22 from your /32 → key permissions.</b>"
    },
    {
     "type": "code",
     "file": "Unit14_vpc_planner.py",
     "level": "high",
     "title": "The lab plan (subnet-a, subnet-b) validated, with 254 vs 251 asserted"
    },
    {
     "type": "traps",
     "items": [
      "Opening SSH (22) to 0.0.0.0/0 scores zero in Lab A3; only HTTP and HTTPS are public.",
      "Associating rt-public with <b>both</b> subnets makes subnet-b public too; the grader wants exactly one.",
      "Adding Anywhere-IPv6 creates extra rules; \"exactly three inbound rules\" then fails.",
      "Forgetting the tag on the route table makes your routing invisible to the grader.",
      "Security groups have no deny rules and are stateful; network ACLs are the stateless, ordered allow/deny lists."
     ]
    }
   ],
   "practice": [
    {
     "id": "u14-E-1",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "15.14",
     "q": "<p>Which inbound rule set for <code>web-sg</code> earns full marks in Lab A3?</p>",
     "options": [
      "22, 80, 443 all from 0.0.0.0/0",
      "22 from My IP /32; 80 and 443 from 0.0.0.0/0",
      "22 from My IP /32; 80 and 443 from 0.0.0.0/0 and ::/0",
      "80 and 443 from 0.0.0.0/0 only"
     ],
     "answer": 1,
     "why": [
      "SSH open to the world scores zero for that item.",
      "Exactly the three required rules.",
      "IPv6 rules count as extra rules; exactly three are required.",
      "SSH from your IP is required."
     ],
     "explain": "<p>22 from a single /32; 80 and 443 from anywhere (IPv4).</p>"
    },
    {
     "id": "u14-E-2",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "15.14",
     "q": "<p>Concept tag <code>csai321:defaultrules</code>: how many <b>inbound</b> rules does a brand-new security group have?</p>",
     "options": [
      "0",
      "1",
      "2",
      "3"
     ],
     "answer": 0,
     "why": [
      "A new SG has no inbound rules, so all inbound traffic is denied (AWS EC2 User Guide).",
      "One rule exists, but it is the outbound allow-all rule.",
      "No; that confuses it with the VPC default SG's rules.",
      "That is the count you add in Lab A3."
     ],
     "explain": "<p><b>0</b>.</p>"
    },
    {
     "id": "u14-E-3",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "15.14",
     "q": "<p>Concept tag <code>csai321:hosts</code>: usable addresses in subnet 10.20.1.0/24 <b>using the AWS rule</b>? (integer)</p>",
     "answer": 251,
     "tol": 0,
     "unit": "addresses",
     "verify": "2**(32-24)-5",
     "steps": [
      {
       "tex": "2^{8} = 256",
       "why": "Total."
      },
      {
       "tex": "256 - 5 = 251",
       "why": "AWS reserves 5; the generic answer would be 254."
      }
     ],
     "explain": "<p><b>251</b> (generic 254; the lab text does not say which it expects).</p>"
    },
    {
     "id": "u14-E-4",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "15.14",
     "q": "<p>In Lab A4, why is subnet-b private?</p>",
     "options": [
      "Its CIDR 10.20.2.0/24 is private",
      "It is implicitly associated with the main route table, which has only the local route",
      "Auto-assign public IPv4 is disabled",
      "It is in us-east-1b"
     ],
     "answer": 1,
     "why": [
      "subnet-a is also 10.x and is public.",
      "No 0.0.0.0/0 → igw route means private.",
      "That affects the instances' addresses, not the subnet's routing.",
      "AZ has nothing to do with it."
     ],
     "explain": "<p>Routing decides: main table, local route only.</p>"
    },
    {
     "id": "u14-E-5",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "15.14",
     "q": "<p>In rt-public, what destination CIDR do you enter for the route whose target is igw-lab?</p>",
     "answer": "0.0.0.0/0",
     "verify": "'.'.join(['0'] * 4) + '/' + str(0)",
     "explain": "<p>The default route <b>0.0.0.0/0</b> matches every IPv4 destination not covered by a more specific route.</p>"
    },
    {
     "id": "u14-E-6",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "15.14",
     "q": "<p>Choosing \"My IP\" as an SSH source in the console stores which kind of CIDR?</p>",
     "options": [
      "Your public address as /32",
      "Your private address as /24",
      "0.0.0.0/0",
      "Your ISP's /16"
     ],
     "answer": 0,
     "why": [
      "Exactly one address: $2^{0}$ = 1.",
      "The SG sees your public address, and the console uses /32.",
      "That is Anywhere-IPv4.",
      "Far too wide."
     ],
     "explain": "<p><b>/32</b> of your current public IPv4.</p>"
    },
    {
     "id": "u14-E-7",
     "type": "msq",
     "tag": "University-Midsem-style",
     "topic": "15.14",
     "q": "<p>Lab A4 requires the tag <code>csai321:lab = vpc-reach</code> on which resources? Select ALL.</p>",
     "options": [
      "The route table rt-public",
      "The internet gateway igw-lab",
      "The security group admin-sg",
      "The key pair key-lab"
     ],
     "answer": [
      0,
      1,
      2
     ],
     "why": [
      "Listed; \"the route table is the one people forget\".",
      "Listed.",
      "Listed.",
      "Not in the list (VPC, both subnets, IGW, route table, SG, EC2)."
     ],
     "explain": "<p>Route table, IGW and SG (plus VPC, subnets and EC2).</p>"
    }
   ]
  },
  {
   "id": "14-F",
   "title": "VLSM: Variable-Length Subnet Masks (Largest First)",
   "badge": "extra",
   "source": "RFC 1878; RFC 4632; Forouzan §19.1; Tanenbaum §5.6.2",
   "covers": [
    "14.9"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "Cut the biggest pieces of cake first",
     "html": "<p><b>Intuition.</b> Equal-size subnetting wastes space when departments differ (100 hosts and a 2-host router link should not both get /25s). <b>VLSM</b> gives each subnet its own prefix. Allocate the <b>largest</b> first: each block then starts on a boundary that is automatically aligned for every smaller block after it, so nothing overlaps and gaps are avoided.</p><p><b>Rule.</b> For each demand $N_i$ (sorted descending) choose the smallest $h_i$ with $2^{h_i} - 2 \\ge N_i$, give it the next free block of size $2^{h_i}$, and move the cursor forward.</p>"
    },
    {
     "type": "derivation",
     "title": "VLSM sizing",
     "steps": [
      {
       "tex": "h_i = \\lceil \\log_2 (N_i + 2) \\rceil,\\; n_i = 32 - h_i",
       "why": "Same sizing rule as Unit 13, one subnet at a time."
      },
      {
       "tex": "100 \\to h = 7\\;(/25);\\; 50 \\to 6\\;(/26);\\; 25 \\to 5\\;(/27);\\; 2 \\to 2\\;(/30)",
       "why": "102 ≤ 128, 52 ≤ 64, 27 ≤ 32, 4 ≤ 4."
      },
      {
       "tex": "128 + 64 + 32 + 4 = 228 \\le 256",
       "why": "The /24 is large enough."
      },
      {
       "tex": "\\text{start}_{i+1} = \\text{start}_i + 2^{h_i}",
       "why": "Descending sizes keep every start a multiple of its own block size."
      }
     ]
    },
    {
     "type": "worked",
     "title": "192.168.10.0/24 for 100, 50, 25 and 2 hosts",
     "tag": "GATE-style",
     "problem": "<p>Allocate subnets from 192.168.10.0/24 for LAN-A (100 hosts), LAN-B (50), LAN-C (25) and a WAN link (2), largest first. Give each block's network, first, last, broadcast and usable count, and the first free address afterwards.</p>",
     "steps": [
      {
       "tex": "100 + 2 = 102 \\le 128 \\Rightarrow /25",
       "why": "LAN-A: block 128 at .0: 192.168.10.0/25, hosts .1–.126, broadcast .127."
      },
      {
       "tex": "50 + 2 = 52 \\le 64 \\Rightarrow /26",
       "why": "LAN-B: next free is .128, a multiple of 64: 192.168.10.128/26, hosts .129–.190, broadcast .191."
      },
      {
       "tex": "25 + 2 = 27 \\le 32 \\Rightarrow /27",
       "why": "LAN-C: next free .192, a multiple of 32: 192.168.10.192/27, hosts .193–.222, broadcast .223."
      },
      {
       "tex": "2 + 2 = 4 \\le 4 \\Rightarrow /30",
       "why": "WAN: next free .224, a multiple of 4: 192.168.10.224/30, hosts .225–.226, broadcast .227."
      },
      {
       "tex": "0 + 128 + 64 + 32 + 4 = 228",
       "why": "Next free address 192.168.10.228; 28 addresses (.228–.255) remain for growth."
      }
     ],
     "answer": "<b>LAN-A 192.168.10.0/25 (126 usable); LAN-B 192.168.10.128/26 (62); LAN-C 192.168.10.192/27 (30); WAN 192.168.10.224/30 (2); next free 192.168.10.228.</b>"
    },
    {
     "type": "table",
     "head": [
      "Subnet",
      "Hosts",
      "Block",
      "Network",
      "First",
      "Last",
      "Broadcast",
      "Usable"
     ],
     "rows": [
      [
       "LAN-A",
       "100",
       "128 (/25)",
       "192.168.10.0",
       "192.168.10.1",
       "192.168.10.126",
       "192.168.10.127",
       "126"
      ],
      [
       "LAN-B",
       "50",
       "64 (/26)",
       "192.168.10.128",
       "192.168.10.129",
       "192.168.10.190",
       "192.168.10.191",
       "62"
      ],
      [
       "LAN-C",
       "25",
       "32 (/27)",
       "192.168.10.192",
       "192.168.10.193",
       "192.168.10.222",
       "192.168.10.223",
       "30"
      ],
      [
       "WAN",
       "2",
       "4 (/30)",
       "192.168.10.224",
       "192.168.10.225",
       "192.168.10.226",
       "192.168.10.227",
       "2"
      ]
     ],
     "caption": "VLSM result table (asserted in Unit14_subnet_vlsm_bitwise.py)."
    },
    {
     "type": "cheat",
     "title": "VLSM steps",
     "items": [
      "Sort demands descending",
      "Size each: smallest $2^{h} \\ge N + 2$ (AWS: $N + 5$)",
      "Place at the next free address (already aligned when sizes descend)",
      "Record network/first/last/broadcast; advance the cursor by the block size",
      "Point-to-point links: /30 (2 hosts)"
     ]
    },
    {
     "type": "code",
     "file": "Unit14_subnet_vlsm_bitwise.py",
     "level": "low",
     "title": "vlsm(): largest-first allocator with an alignment check"
    },
    {
     "type": "traps",
     "items": [
      "Smallest-first allocation causes misalignment: a /25 cannot start at .4.",
      "25 hosts need a /27 (30 usable), not a /28 (14).",
      "Remember +2 (or +5 in AWS) before rounding up to a power of 2."
     ]
    }
   ],
   "practice": [
    {
     "id": "u14-F-1",
     "type": "text",
     "tag": "GATE-style",
     "topic": "14.9",
     "q": "<p>VLSM, largest first, from 172.16.0.0/24 for 60, 30, 12 and 2 hosts. What is the network address and prefix of the 12-host subnet?</p>",
     "answer": "172.16.0.96/28",
     "verify": "'172.16.0.' + str(64 + 32) + '/' + str(32 - 4)",
     "steps": [
      {
       "tex": "60 \\to /26,\\; 30 \\to /27",
       "why": "62 ≥ 60 and 30 ≥ 30."
      },
      {
       "tex": "64 + 32 = 96",
       "why": "Cursor after two blocks."
      },
      {
       "tex": "12 + 2 = 14 \\le 16 \\Rightarrow /28",
       "why": "4 host bits."
      }
     ],
     "explain": "<p>60 → /26 at .0 (0–63); 30 → /27 at .64 (64–95); 12 → 14 ≤ 16 → /28 at <b>.96</b> (96–111); 2 → /30 at .112.</p>"
    },
    {
     "id": "u14-F-2",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "14.9",
     "q": "<p>In the previous plan, what is the last octet of the first free address after all four subnets? (integer)</p>",
     "answer": 116,
     "tol": 0,
     "unit": "",
     "verify": "64+32+16+4",
     "steps": [
      {
       "tex": "64 + 32 + 16 + 4 = 116",
       "why": "Sum of the four block sizes from .0."
      }
     ],
     "explain": "<p><b>116</b> (172.16.0.116).</p>"
    },
    {
     "id": "u14-F-3",
     "type": "text",
     "tag": "GATE-style",
     "topic": "14.9",
     "q": "<p>GATE-style: what is the broadcast address of the subnet containing 10.10.10.77/28?</p>",
     "answer": "10.10.10.79",
     "verify": "'10.10.10.' + str(77//16*16 + 15)",
     "steps": [
      {
       "tex": "M = 256 - 240 = 16",
       "why": "/28."
      },
      {
       "tex": "\\lfloor 77/16 \\rfloor \\times 16 = 64",
       "why": "Network .64."
      },
      {
       "tex": "64 + 16 - 1 = 79",
       "why": "Broadcast."
      }
     ],
     "explain": "<p>M = 16; 77 → 64; broadcast 64 + 15 = <b>79</b>.</p>"
    },
    {
     "id": "u14-F-4",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "14.9",
     "q": "<p>Why does VLSM allocate the largest subnet first?</p>",
     "options": [
      "Largest subnets need the fewest routes",
      "Each later, smaller block then starts on an address already aligned to its size, so blocks never overlap or need gaps",
      "Routers require it",
      "It maximises the number of broadcast addresses"
     ],
     "answer": 1,
     "why": [
      "Each subnet is one route regardless of size.",
      "Descending powers of two keep the cursor aligned.",
      "No router rule exists.",
      "Irrelevant and not a goal."
     ],
     "explain": "<p>Alignment.</p>"
    },
    {
     "id": "u14-F-5",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "14.9",
     "q": "<p>How many addresses of 192.168.10.0/24 are consumed by the 100/50/25/2 VLSM plan? (integer)</p>",
     "answer": 228,
     "tol": 0,
     "unit": "addresses",
     "verify": "2**7+2**6+2**5+2**2",
     "steps": [
      {
       "tex": "128 + 64 + 32 + 4 = 228",
       "why": "Block sizes /25, /26, /27, /30."
      }
     ],
     "explain": "<p><b>228</b> (28 left).</p>"
    }
   ]
  }
 ]
};
