# Computer Networks — Coding & Lab Questions

## Lectures

### CN_LAB_DHCP_SectionD — 22 Sep 2026

#### Dual-LAN DHCP: Router as DHCP Server with Relay
_Network lab (simulator) · Medium · Solved ✓ · 20/20 pts_

###### Objective

Configure **Router0** as the DHCP server for two separate LANs. **LAN-A** (10.0.1.0/24) holds two PCs and an HTTP server; **LAN-B** (10.0.2.0/24) holds two more PCs whose DHCP requests are relayed back to Router0 via `ip helper-address`. At the end, PC0 must be able to reach PC2 across both LANs.

###### Topology to Build

Place all devices on the canvas and connect them with straight-through cables as shown below:

- **Router0** Gi0/0 → **ManagedSwitch0** (LAN-A switch)
- **ManagedSwitch0** → **PC0**, **PC1**, **Server0**
- **Router0** Gi0/1 → **ManagedSwitch1** (LAN-B switch)
- **ManagedSwitch1** → **PC2**, **PC3**

###### IP Address Table

| Device | Interface | IP Address | Subnet Mask | Assigned By |
| --- | --- | --- | --- | --- |
| Router0 | GigabitEthernet0/0 | 10.0.1.1 | 255.255.255.0 | Static |
| Router0 | GigabitEthernet0/1 | 10.0.2.1 | 255.255.255.0 | Static |
| PC0 | FastEthernet0 | 10.0.1.2 | 255.255.255.0 | DHCP |
| PC1 | FastEthernet0 | 10.0.1.3 | 255.255.255.0 | DHCP |
| Server0 | FastEthernet0 | 10.0.1.4 | 255.255.255.0 | DHCP |
| PC2 | FastEthernet0 | 10.0.2.2 | 255.255.255.0 | DHCP |
| PC3 | FastEthernet0 | 10.0.2.3 | 255.255.255.0 | DHCP |

###### Configuration Steps

###### Step 1 — Configure Router0

Open Router0's CLI and run the following commands:

```

enable
configure terminal

interface GigabitEthernet0/0
 ip address 10.0.1.1 255.255.255.0
 no shutdown
 exit

interface GigabitEthernet0/1
 ip address 10.0.2.1 255.255.255.0
 ip helper-address 10.0.1.1
 no shutdown
 exit

ip dhcp pool LAN-A
 network 10.0.1.0 255.255.255.0
 default-router 10.0.1.1
 exit

ip dhcp pool LAN-B
 network 10.0.2.0 255.255.255.0
 default-router 10.0.2.1
 exit
```

The `ip helper-address 10.0.1.1` command on Gi0/1 forwards DHCP broadcast messages from LAN-B clients to Router0's own DHCP server (at 10.0.1.1), which then hands out addresses from the **LAN-B pool**.

###### Step 2 — Enable HTTP on Server0

1. Click **Server0** → **Services** tab → **HTTP**.
2. Confirm the service is **On**.
3. Add any HTML content you like to the page body.

###### Step 3 — Assign DHCP addresses (strict order)

Open **Desktop → IP Configuration** on each device and select **DHCP**. Then open **Desktop → Command Prompt** and run `ipconfig` to request the lease. Follow this exact order:

1. **PC0** — set DHCP, run `ipconfig`
2. **PC1** — set DHCP, run `ipconfig`
3. **Server0** — set DHCP in IP Configuration, run `ipconfig`
4. **PC2** — set DHCP, run `ipconfig`
5. **PC3** — set DHCP, run `ipconfig`

**Important:** You must run `ipconfig` on every device before clicking *Run Tests* — the DHCP lease checks will fail if a device has not yet requested its address.

###### Step 4 — (Optional) Test HTTP access

1. On **PC0**, open **Desktop → Web Browser**.
2. Enter `http://10.0.1.4` and click **Go**.
3. You should see the HTML page hosted on Server0.

###### Verification

- Click **Run Tests** — all checks should pass.
- From PC0's Command Prompt, run `ping 10.0.2.2` — a successful reply proves Router0 is routing between both LANs.
- Switch to **Simulation** mode and trace the ping to see the Router0 hop and both ARP exchanges.

**My saved topology:** `attachments/CN_LAB_DHCP_SectionD - Dual-LAN DHCP- Router as DHCP Server with Relay.xml`


### CN_Lab_Router on stick_Section D — 23 Sep 2026

#### Lab: VLAN Trunking and Router-on-a-Stick
_Network lab (simulator) · Medium · Solved ✓ · 10/20 pts_

###### Objective

Configure a University network with three VLANs — **Student** (VLAN 10), **Staff** (VLAN 20), and **Admin** (VLAN 30) — all on a single **ManagedSwitch0**. Use a *Router-on-a-Stick* topology: Router0's `GigabitEthernet0/0` connects to the switch trunk port, and three `802.1Q` subinterfaces route between VLANs. Configure per-VLAN DHCP pools on Router0 so all nine PCs receive addresses automatically. At the end, a Student PC must be able to ping an Admin PC across VLANs.

###### Topology to Build

Place all devices and connect with straight-through cables:

- **Router0** Gi0/0 → **ManagedSwitch0** Fa0/1 (trunk)
- **ManagedSwitch0** Fa0/2, Fa0/3, Fa0/4 → **PC0**, **PC1**, **PC2** (VLAN 10 — Student)
- **ManagedSwitch0** Fa0/5, Fa0/6, Fa0/7 → **PC3**, **PC4**, **PC5** (VLAN 20 — Staff)
- **ManagedSwitch0** Fa0/8, Fa0/9, Fa0/10 → **PC6**, **PC7**, **PC8** (VLAN 30 — Admin)

###### IP Address Table

| Device | Interface | IP Address | Subnet Mask | Assigned By |
| --- | --- | --- | --- | --- |
| Router0 | GigabitEthernet0/0.10 | 10.0.1.1 | 255.255.255.0 | Static |
| Router0 | GigabitEthernet0/0.20 | 10.0.2.1 | 255.255.255.0 | Static |
| Router0 | GigabitEthernet0/0.30 | 10.0.3.1 | 255.255.255.0 | Static |
| PC0, PC1, PC2 | FastEthernet0 | 10.0.1.x | 255.255.255.0 | DHCP |
| PC3, PC4, PC5 | FastEthernet0 | 10.0.2.x | 255.255.255.0 | DHCP |
| PC6, PC7, PC8 | FastEthernet0 | 10.0.3.x | 255.255.255.0 | DHCP |

###### Configuration Steps

###### Step 1 — Configure ManagedSwitch0

Open ManagedSwitch0's CLI and run:

```

enable
configure terminal

vlan 10
 name Student
 exit

vlan 20
 name Staff
 exit

vlan 30
 name Admin
 exit

interface FastEthernet0/1
 switchport mode trunk
 exit

interface FastEthernet0/2
 switchport mode access
 switchport access vlan 10
 exit

interface FastEthernet0/3
 switchport mode access
 switchport access vlan 10
 exit

interface FastEthernet0/4
 switchport mode access
 switchport access vlan 10
 exit

interface FastEthernet0/5
 switchport mode access
 switchport access vlan 20
 exit

interface FastEthernet0/6
 switchport mode access
 switchport access vlan 20
 exit

interface FastEthernet0/7
 switchport mode access
 switchport access vlan 20
 exit

interface FastEthernet0/8
 switchport mode access
 switchport access vlan 30
 exit

interface FastEthernet0/9
 switchport mode access
 switchport access vlan 30
 exit

interface FastEthernet0/10
 switchport mode access
 switchport access vlan 30
 exit
```

###### Step 2 — Configure Router0 (Router-on-a-Stick)

Open Router0's CLI and run:

```

enable
configure terminal

interface GigabitEthernet0/0
 no shutdown
 exit

interface GigabitEthernet0/0.10
 encapsulation dot1Q 10
 ip address 10.0.1.1 255.255.255.0
 exit

interface GigabitEthernet0/0.20
 encapsulation dot1Q 20
 ip address 10.0.2.1 255.255.255.0
 exit

interface GigabitEthernet0/0.30
 encapsulation dot1Q 30
 ip address 10.0.3.1 255.255.255.0
 exit

ip dhcp pool STUDENT
 network 10.0.1.0 255.255.255.0
 default-router 10.0.1.1
 exit

ip dhcp pool STAFF
 network 10.0.2.0 255.255.255.0
 default-router 10.0.2.1
 exit

ip dhcp pool ADMIN
 network 10.0.3.0 255.255.255.0
 default-router 10.0.3.1
 exit
```

The physical interface `GigabitEthernet0/0` must be `no shutdown` first. Each subinterface (`.10`, `.20`, `.30`) tags its frames with the matching VLAN ID using `encapsulation dot1Q`, acting as the default gateway for that VLAN.

###### Step 3 — Assign IP addresses using DHCP (strict order)

Open **Desktop → IP Configuration** on each PC and select **DHCP**. Then open **Desktop → Command Prompt** and run `ipconfig` to request the lease. Follow this order:

1. **PC0**, **PC1**, **PC2** — set DHCP, run `ipconfig` on each
2. **PC3**, **PC4**, **PC5** — set DHCP, run `ipconfig` on each
3. **PC6**, **PC7**, **PC8** — set DHCP, run `ipconfig` on each

**Important:** You must run `ipconfig` on every PC before clicking *Run Tests* — the DHCP lease checks will fail if a device has not yet requested its address.

###### Verification

- Click **Run Tests** — all checks should pass.
- From PC0's Command Prompt, run `ping 10.0.3.2` — a successful reply confirms inter-VLAN routing is working via Router0's subinterfaces.
- Switch to **Simulation** mode and trace the ping from PC0 to PC6; observe the dot1Q-tagged frames passing through the trunk and Router0's subinterface hop.

**My saved topology:** `attachments/CN_Lab_Router on stick_Section D - Lab- VLAN Trunking and Router-on-a-Stick.xml`


## Labs

### Sample CN Contest Coding — 01 Sep 2026

#### Sample of Contest
_Network lab (simulator) · Medium · Solved ✓ · 20/20 pts_

###### CSAI321 — Q3. Launch a Web Server and Lock Down Its Firewall

**Duration:** 20 minutes  ·  **Marks:** 15  ·  **Environment:** AWS Academy Learner Lab, AWS Console only, region `us-east-1`, Amazon Linux 2023, `t3.micro`.

###### Scenario

A web server has to be reachable by the public on HTTP and HTTPS, while administration stays locked to **your** machine alone. Build the security group first, then launch one instance behind it.

**You do not build a network in this question.** Use the **default VPC** that already exists in your lab account — do not create a VPC, subnet, internet gateway or route table. The whole exercise is the instance and its firewall.

Use the exact names given. The grader matches names literally, and a security group's name **cannot be changed after creation** — so read Part A before you start typing.

###### Mandatory tagging contract

Your work is found *only* through this tag. Both resources you create must carry it, in `us-east-1`:

| Tag key | Tag value |
| --- | --- |
| `csai321:lab` | `ec2-firewall` |

Applies to: the **security group** and the **EC2 instance**. **Either one missing this tag is invisible to the grader and scores zero.** Both can be tagged at creation time — the console offers a tags panel on each.

###### Part A — The security group and its inbound rules (9 marks)

*Note:* AWS reserves the `sg-` prefix for security group IDs and will reject a name that starts with it. The name below is `web-sg`, not `sg-web`. Type it exactly — it cannot be edited afterwards.

**EC2 → Security groups → Create security group**

| Field | Value |
| --- | --- |
| Name | `web-sg` |
| Description | `csai321 public web server` |
| VPC | the **default** VPC |

Add **exactly three** inbound rules — no more, no fewer:

| # | Type | Protocol | Port | Source |
| --- | --- | --- | --- | --- |
| 1 | SSH | TCP | 22 | **My IP** — must resolve to a single `/32` |
| 2 | HTTP | TCP | 80 | `0.0.0.0/0` (Anywhere-IPv4) |
| 3 | HTTPS | TCP | 443 | `0.0.0.0/0` (Anywhere-IPv4) |

Leave **outbound at its default** (all traffic allowed). Do not add an IPv6 source to any rule — an *Anywhere-IPv6* entry counts as a fourth rule and will cost you the rule-count mark.

The whole point of the split: **ports 80 and 443 are public, port 22 is not.** SSH open to `0.0.0.0/0` scores zero for that item even though the server would still work — an administrative port exposed to the internet is the single most common way a lab instance gets compromised.

###### Part B — The instance (5 marks)

**EC2 → Instances → Launch instances**

| Setting | Value |
| --- | --- |
| Name | `web-server` |
| AMI | Amazon Linux 2023 |
| Instance type | `t3.micro` |
| Key pair | create new, `key-web`, RSA, `.pem` (or proceed without one) |
| Network | the **default** VPC, any default subnet |
| Auto-assign public IP | **Enable** |
| Security group | select existing → `web-sg` |
| Storage | default |

Nothing needs to be installed on it. Leave the instance **running**, and confirm on the instance detail page that it has a public IPv4 and that `web-sg` is attached.

**Launch exactly one instance named `web-server`.** If an earlier attempt is still around, terminate it — two instances carrying that name make the grading ambiguous and the part scores zero.

###### Part C — Concept tag (1 mark)

The concept is graded through a tag value, so the answer must be exact. Add this **extra** tag to the `web-server` instance:

| Tag key | What to enter |
| --- | --- |
| `csai321:defaultrules` | The number of **inbound** rules a brand-new security group has before you add any, digits only |

No spaces, no units, no punctuation.

###### Grading summary

Every part is scored automatically from your account when you submit. Each item is scored independently — a mistake in one does not cascade into the others.

| Part | Checks | Marks |
| --- | --- | --- |
| A | SSH on 22 from a single `/32` and not the world (3); HTTP on 80 admitted (2); HTTPS on 443 admitted (2); exactly three inbound rules in total (2) | 9 |
| B | `web-server` is a running `t3.micro` with a public IPv4, carrying `web-sg` | 5 |
| C | `csai321:defaultrules` on the instance matches the expected value | 1 |
| — | Either resource missing `csai321:lab = ec2-firewall` is invisible to the grader and scores zero | — |
|  | **Total** | **15** |

###### How to submit

Finish the build, confirm `web-server` shows state **running** and that both it and `web-sg` carry `csai321:lab = ec2-firewall`, then paste your Learner Lab credentials (Access Key ID, Secret Access Key, Session Token) and the region `us-east-1` into the form below and submit. The grader reads your account **read-only**; nothing is uploaded and your credentials are not stored.

###### Do not terminate

Leave both resources in place until your run has been scored. Stopping the Learner Lab session is fine; terminating the instance or deleting the security group is not.

###### Notes for the Learner Lab

- **Session resets (~4h):** build and submit in the *same* lab session, before your resources are torn down and your credentials expire.
- **Region:** everything must be created in `us-east-1`. Resources in another region are invisible to the grader and score zero, with no warning.
- **"My IP"** fills in your current public address as a `/32`. If your network changes between building and submitting, the rule is still a `/32` and still scores — it does not have to match where you are sitting at submission time.
- Log in to the lab from the AWS Academy course page (link in your class portal).



### Application Layer - In Class — 03 Sep 2026

#### Csai321-vpc-reach
_Network lab (simulator) · Easy · Solved ✓ · 20/20 pts_

###### CSAI321 — Q1. Build a Custom VPC and a Reachable Instance Inside It

**Duration:** 30 minutes  ·  **Marks:** 20  ·  **Environment:** AWS Academy Learner Lab, AWS Console only, region `us-east-1`, Amazon Linux 2023, `t3.micro`.

###### Scenario

Build a small network from scratch — **not** the default VPC — place one instance inside it, and leave it reachable on SSH. Nothing is hosted on the instance. Every step is done through the AWS Console.

Use the **exact** names, CIDRs, and tag values given. The grader matches strings literally; a renamed or re-sized resource is a wrong resource. (Names you type in the console are stored as `Name` tags; that is what is compared.)

###### Mandatory tagging contract

The grader finds your work *only* through this tag. Every resource you create must carry it, in `us-east-1`:

| Tag key | Tag value |
| --- | --- |
| `csai321:lab` | `vpc-reach` |

Applies to: the VPC, both subnets, the internet gateway, **the route table**, the security group, and the EC2 instance. **Any resource missing this tag is invisible to the grader and scores zero.**

**The route table is the one people forget.** An untagged route table is invisible to the grader, and a subnet whose routing cannot be seen reads as private — which silently costs you the routing marks in Part B on a build that looks correct in the console. Tag it.

*Tip:* the VPC creation wizard can apply a tag to every resource it creates in one pass. Use it, then confirm the tag landed on each resource individually.

###### Part A — VPC and subnets (7 marks)

**VPC → Your VPCs → Create VPC**

| Setting | Value |
| --- | --- |
| Name | `vpc-lab` |
| IPv4 CIDR | `10.20.0.0/16` |
| IPv6 | none |
| Tenancy | default |

**VPC → Subnets → Create subnet**, inside `vpc-lab`:

| Name | CIDR | Availability Zone | Auto-assign public IPv4 |
| --- | --- | --- | --- |
| `subnet-a` | `10.20.1.0/24` | `us-east-1a` | Enable |
| `subnet-b` | `10.20.2.0/24` | `us-east-1b` | Leave disabled |

Auto-assign is set after creation via **Actions → Edit subnet settings**.

`subnet-b` stays empty. It exists so the grader can confirm you placed two subnets in two distinct Availability Zones inside one region.

###### Part B — Internet gateway and routing (4 marks)

1. **Internet gateways → Create internet gateway**, name `igw-lab`.
2. **Actions → Attach to VPC → `vpc-lab`**.
3. **Route tables → Create route table**, name `rt-public`, VPC `vpc-lab`.
4. Open it → **Routes → Edit routes** → add route: destination `0.0.0.0/0`, target `igw-lab`.
5. **Subnet associations → Edit subnet associations**: tick `subnet-a` *only*. `subnet-b` must stay on the main route table.

###### Part C — Security group (3 marks)

*Note:* AWS reserves the `sg-` prefix for security group IDs and will reject a name that starts with it, which is why the name below is `admin-sg` and not `sg-admin`. Use it exactly as written — the grader matches the name literally, and a security group name cannot be changed after creation.

**VPC → Security groups → Create security group**

| Field | Value |
| --- | --- |
| Name | `admin-sg` |
| Description | `csai321 admin access` |
| VPC | `vpc-lab` |
| Inbound | exactly one rule — Type SSH, Protocol TCP, Port 22, Source **My IP** |
| Outbound | leave at default |

The source must resolve to a single `/32`. Port 22 open to `0.0.0.0/0` scores zero for this part, and so does a second inbound rule.

###### Part D — EC2 instance (5 marks)

**EC2 → Instances → Launch instances**

| Setting | Value |
| --- | --- |
| Name | `ec2-lab` |
| AMI | Amazon Linux 2023 |
| Instance type | `t3.micro` |
| Key pair | create new, `key-lab`, RSA, `.pem` |
| VPC | `vpc-lab` |
| Subnet | `subnet-a` |
| Auto-assign public IP | Enable |
| Security group | select existing → `admin-sg` |
| Storage | default |

Leave the instance **running**. On the instance detail page confirm it has both a private IPv4 in `10.20.1.x` and a public IPv4.

Optional self-check from your own terminal (*not graded*):

```

chmod 400 key-lab.pem
ssh -i key-lab.pem ec2-user@<PUBLIC_IPv4>
```

If it fails, the cause is almost always the route table association or a missing public IP.

###### Part E — Concept tag (1 mark)

The concept is graded through a tag value, so the answer must be exact. Add this **extra** tag to `vpc-lab` — on the VPC only:

| Tag key | What to enter |
| --- | --- |
| `csai321:hosts` | The number of usable host addresses in `10.20.1.0/24`, digits only |

No spaces, no units, no punctuation.

###### Grading summary

Every part is scored automatically from your account when you submit. Each item is scored independently — a mistake in one part does not cascade into the others.

| Part | Checks | Marks |
| --- | --- | --- |
| A | VPC CIDR is `10.20.0.0/16`; two subnets in two distinct AZs | 7 |
| B | IGW attached to the VPC; only one subnet routes `0.0.0.0/0` to it | 4 |
| C | `admin-sg` has exactly one inbound rule, TCP 22, from a single `/32` | 3 |
| D | `ec2-lab` is a running `t3.micro` in `subnet-a`, carrying `admin-sg`, with a public IPv4 | 5 |
| E | `csai321:hosts` on the VPC matches the expected value | 1 |
| — | Any resource missing `csai321:lab = vpc-reach` is invisible to the grader and scores zero | — |
|  | **Total** | **20** |

###### How to submit

Finish the build, confirm `ec2-lab` shows state **running** and every resource carries `csai321:lab = vpc-reach`, then paste your Learner Lab credentials (Access Key ID, Secret Access Key, Session Token) and the region `us-east-1` into the form below and submit. The grader reads your account **read-only**; nothing is uploaded and your credentials are not stored.

###### Do not terminate

Leave all resources in place until your run has been scored. Stopping the Learner Lab session is fine; terminating the instance or deleting the VPC is not.

###### Notes for the Learner Lab

- **Session resets (~4h):** build and submit in the *same* lab session, before your resources are torn down and your credentials expire.
- **Region:** everything must be created in `us-east-1`. Resources in another region are invisible to the grader and score zero, with no warning.
- Log in to the lab from the AWS Academy course page (link in your class portal).



### CN_Lab_NPT_D — 29 Sep 2026

#### Gaming Lab LAN
_Network lab (simulator) · Medium · Solved ✓ · 20/20 pts_

###### Objective

Configure a **Gaming Lab LAN** for a gaming center. Router0 acts as the default gateway, DHCP server, and DNS resolver for the entire network. Server0 runs an HTTP game portal. Three gaming PCs (PC0–PC2) must receive their IPs automatically via DHCP and be able to browse to the game server by name. You will discover the configuration commands yourself using the router's built-in CLI help system.

###### Topology to Build

Add all six devices and connect them with straight-through cables:

- **Router0** GigabitEthernet0/0 → **ManagedSwitch0** FastEthernet0/1
- **ManagedSwitch0** FastEthernet0/2 → **Server0**
- **ManagedSwitch0** FastEthernet0/3 → **PC0**
- **ManagedSwitch0** FastEthernet0/4 → **PC1**
- **ManagedSwitch0** FastEthernet0/5 → **PC2**

###### IP Address Table

| Device | Interface | IP Address | Subnet Mask | Assigned By |
| --- | --- | --- | --- | --- |
| Router0 | GigabitEthernet0/0 | 192.168.10.1 | 255.255.255.0 | Static |
| Server0 | FastEthernet0 | 192.168.10.10 | 255.255.255.0 | Static |
| PC0, PC1, PC2 | FastEthernet0 | 192.168.10.x | 255.255.255.0 | DHCP |

###### Configuration Steps

There are no step-by-step commands provided in this lab — you must configure the network by exploring the CLI help system. Use the `?` character at any prompt to discover available commands and their syntax.

###### Goal 1 — Configure Router0 interface

Assign IP address `192.168.10.1 255.255.255.0` to `GigabitEthernet0/0` and bring it up. Inside `configure terminal`, try typing `interface ?` to see interface options, then enter the interface and type `ip ?` to explore address configuration.

###### Goal 2 — Create DHCP pool on Router0

Create a DHCP pool named exactly **GAMING** that serves the `192.168.10.0 255.255.255.0` network with default gateway `192.168.10.1`. In global config mode, type `ip ?` and look for the `dhcp` keyword. Explore further with `ip dhcp ?`.

###### Goal 3 — Add a DNS host entry on Router0

Map the hostname **game-server** to IP `192.168.10.10` so PCs can reach the server by name. In global config mode, type `ip ?` and look for the `host` keyword. The required commands are:

- `ip host <hostname> <ip>` — Add a static DNS entry
- `no ip host <hostname>` — Remove a static DNS entry

Use `ip host ?` to see the exact syntax before entering the command.

###### Goal 4 — Configure Server0

Set Server0's IP address to `192.168.10.10 255.255.255.0` with gateway `192.168.10.1` using the **Desktop → IP Configuration** tab. In the **Services → HTTP** tab, enable the HTTP service and edit the default page so it contains the text **Welcome to Game Server**.

###### Goal 5 — Configure PCs

On each PC (PC0, PC1, PC2), open **Desktop → IP Configuration** and select **DHCP**. Then open **Desktop → Command Prompt** and run `ipconfig` to request a lease. Do this for all three PCs before clicking *Run Tests*.

###### Verification

- From PC0's Command Prompt, run `ipconfig` — the IP should be in the `192.168.10.0/24` range with gateway `192.168.10.1`.
- From PC0's Command Prompt, run `ping 192.168.10.10` — the ping should succeed.
- Open PC0's **Desktop → Web Browser** and visit `http://192.168.10.10` — the game portal page must load.
- Click **Run Tests** — all checks must pass.

###### Hint

In the router CLI, entering `configure terminal` and then typing a partial command followed by `?` (for example `ip dhcp ?`) displays a list of all sub-commands and their descriptions. This is the primary way to explore commands without referring to external documentation. The DHCP pool sub-mode also accepts `?`.

**My saved topology:** `attachments/CN_Lab_NPT_D - Gaming Lab LAN.xml`


#### Industrial Multi-Segment Network
_Network lab (simulator) · Medium · Solved ✓ · 20/20 pts_

###### Objective

Configure an **Industrial Multi-Segment Network** for a manufacturing facility. The network has five separate segments: two *physically isolated* LANs (IT and Operations departments) connected to dedicated router interfaces, and three *VLANs* (Engineering, Manufacturing, Management) carried over a single trunk link to a managed switch. Router0 acts as the gateway, DHCP server, and DNS resolver for all five segments. You will discover every configuration command yourself using the CLI help system.

###### Topology to Build

Add all devices and connect with straight-through cables. The two physical LANs each have their own unmanaged switch. The three VLANs share one ManagedSwitch0 via a trunk.

- **Router0** GigabitEthernet0/0 → **ManagedSwitch0** FastEthernet0/1 (LAN-A, IT)
- **Router0** GigabitEthernet0/1 → **ManagedSwitch1** FastEthernet0/1 (LAN-B, Operations)
- **Router0** GigabitEthernet0/2 → **ManagedSwitch2** FastEthernet0/1 (trunk)
- **ManagedSwitch0** Fa0/2 → **PC0**, Fa0/3 → **PC1**
- **ManagedSwitch1** Fa0/2 → **PC2**, Fa0/3 → **PC3**
- **ManagedSwitch2** Fa0/2 → **Server0** (Engineering), Fa0/3 → **PC4**
- **ManagedSwitch2** Fa0/4 → **Server1** (Manufacturing), Fa0/5 → **PC5**
- **ManagedSwitch2** Fa0/6 → **PC6** (Management)

###### IP Address Table

| Segment | Device | Interface | IP / Gateway | Assigned By |
| --- | --- | --- | --- | --- |
| LAN-A (IT) | Router0 | GigabitEthernet0/0 | 192.168.1.1 /24 | Static |
| LAN-A (IT) | PC0, PC1 | FastEthernet0 | 192.168.1.x — gw 192.168.1.1 | DHCP pool **LAN-A** |
| LAN-B (Ops) | Router0 | GigabitEthernet0/1 | 192.168.2.1 /24 | Static |
| LAN-B (Ops) | PC2, PC3 | FastEthernet0 | 192.168.2.x — gw 192.168.2.1 | DHCP pool **LAN-B** |
| VLAN 10 (Engineering) | Router0 | GigabitEthernet0/2.10 | 10.10.10.1 /24 | Static |
| VLAN 10 (Engineering) | Server0 | FastEthernet0 | 10.10.10.10 — gw 10.10.10.1 | Static |
| VLAN 10 (Engineering) | PC4 | FastEthernet0 | 10.10.10.x — gw 10.10.10.1 | DHCP pool **ENGINEERING** |
| VLAN 20 (Manufacturing) | Router0 | GigabitEthernet0/2.20 | 10.10.20.1 /24 | Static |
| VLAN 20 (Manufacturing) | Server1 | FastEthernet0 | 10.10.20.10 — gw 10.10.20.1 | Static |
| VLAN 20 (Manufacturing) | PC5 | FastEthernet0 | 10.10.20.x — gw 10.10.20.1 | DHCP pool **MANUFACTURING** |
| VLAN 30 (Management) | Router0 | GigabitEthernet0/2.30 | 10.10.30.1 /24 | Static |
| VLAN 30 (Management) | PC6 | FastEthernet0 | 10.10.30.x — gw 10.10.30.1 | DHCP pool **MANAGEMENT** |

**DNS entries on Router0:** `eng-server → 10.10.10.10`, `mfg-server → 10.10.20.10`

###### Configuration Steps

No step-by-step commands are provided. Use the `?` help character in the CLI to explore available commands at every point. Below are the configuration *goals* you need to achieve.

###### Goal 1 — Router0 physical interfaces (LAN-A and LAN-B)

Assign IP addresses to `GigabitEthernet0/0` (192.168.1.1 /24) and `GigabitEthernet0/1` (192.168.2.1 /24). Both interfaces must be brought up. Enter each interface and use `ip ?` to see address options.

###### Goal 2 — Router0 trunk interface and subinterfaces (VLANs)

Bring up `GigabitEthernet0/2` (no IP address; it is the physical trunk). Then create three subinterfaces using the dot notation: `GigabitEthernet0/2.10`, `.20`, and `.30`. Inside each subinterface, use `encapsulation dot1Q <vlan-id>` to tag VLAN traffic and assign the gateway IP. Use `encapsulation ?` to confirm the syntax.

###### Goal 3 — DHCP pools on Router0

Create five DHCP pools with these exact names (case-sensitive): **LAN-A**, **LAN-B**, **ENGINEERING**, **MANUFACTURING**, **MANAGEMENT**. In global config mode, type `ip ?` to locate the `dhcp` keyword. The following commands are available to explore:

- `ip dhcp pool <name>` — Create or edit a DHCP pool
- `no ip dhcp pool <name>` — Delete a DHCP pool

Inside the DHCP pool sub-mode, type `?` to see sub-commands like `network` and `default-router`.

###### Goal 4 — DNS host entries on Router0

Add two static DNS entries so devices can reach servers by hostname: **eng-server → 10.10.10.10** and **mfg-server → 10.10.20.10**. In global config mode, explore using:

- `ip host <hostname> <ip>` — Add a static DNS entry
- `no ip host <hostname>` — Remove a static DNS entry

###### Goal 5 — ManagedSwitch2 VLAN and trunk configuration

In ManagedSwitch2's CLI, create VLANs 10, 20, and 30 with names **Engineering**, **Manufacturing**, and **Management**. Configure `ManagedSwitch2`'s `FastEthernet0/1` as a trunk port. Assign each remaining port to its VLAN. Explore with `switchport ?` inside an interface to see available switchport modes.

###### Goal 6 — Server and PC configuration

Set Server0 (IP 10.10.10.10 /24, gw 10.10.10.1) and Server1 (IP 10.10.20.10 /24, gw 10.10.20.1) using **Desktop → IP Configuration**. Enable HTTP on both servers via **Services → HTTP** and add a custom page for each.

On PC0–PC3 (physical LANs) and PC4–PC6 (VLANs), select DHCP in **Desktop → IP Configuration**, then run `ipconfig` in the **Command Prompt** to request a lease. Do this for all graded PCs before clicking *Run Tests*.

###### Verification

- From PC0 Command Prompt: `ipconfig` → IP in 192.168.1.0/24, gateway 192.168.1.1.
- From PC4 Command Prompt: `ipconfig` → IP in 10.10.10.0/24, gateway 10.10.10.1.
- From PC4 Command Prompt: `ping 10.10.20.10` → success (cross-VLAN via Router0).
- From PC4 Web Browser: `http://10.10.20.10` → Manufacturing server page loads.
- Click **Run Tests** — all checks must pass.

###### Hint

For the subinterface trunk, remember to bring up the *physical* interface (`GigabitEthernet0/2`, `no shutdown`) before configuring subinterfaces — the subinterfaces inherit the physical interface's up/down state. On ManagedSwitch0, the trunk port (`FastEthernet0/1`) must be configured *before* VLAN-tagged traffic from the router reaches access ports. Use `show running-config` on any device to review your settings.

**My saved topology:** `attachments/CN_Lab_NPT_D - Industrial Multi-Segment Network.xml`


### CN_LAB_NAT_D — 01 Oct 2026

#### Static NAT: Publishing Internal Servers
_Network lab (simulator) · Medium · Attempted · 0/20 pts_

##### Static NAT: Publishing Internal Servers  24 pts

*Newton School of Technology NAT Gateway Configuration*

**Discovery Mode:** No CLI commands are given.

###### Scenario

NST's internal network is split into three VLANs: **Office (VLAN 10)**, **Admin (VLAN 20)**, and **Staff (VLAN 30)** all served by **Router0** using router-on-a-stick. Each VLAN has a server that must be reachable from the internet.

**Router0** is the NAT boundary. A WAN cable connects it to **Router1**, which represents the internet-side gateway. **PC6** on Router1's LAN acts as an external client. Using Static NAT, each internal server gets its own *public IP* — Router0 translates the public IP to the private IP on the fly.

**Static NAT in a sentence:** `ip nat inside source static <private> <public>` tells the router "any packet arriving for <public> on the outside should go to <private> inside, and vice-versa." its always One-one.

###### Network Addresses

| Segment | Router/Interface | IP / Subnet | DHCP Pool |
| --- | --- | --- | --- |
| Office VLAN 10 | Router0 Gi0/2.10 | 10.0.10.1 / 255.255.255.0 | OFFICE |
| Admin VLAN 20 | Router0 Gi0/2.20 | 10.0.20.1 / 255.255.255.0 | ADMIN |
| Staff VLAN 30 | Router0 Gi0/2.30 | 10.0.30.1 / 255.255.255.0 | STAFF |
| WAN (Router0) | Router0 Gi0/3 | 100.1.1.1 / 255.255.255.248 (/29) | — |
| WAN (Router1) | Router1 Gi0/0 | 100.1.1.2 / 255.255.255.248 (/29) | — |
| External LAN | Router1 Gi0/1 | 192.168.100.1 / 255.255.255.0 | EXTERNAL |

###### Servers (Static IPs) and NAT Public Addresses

| Device | VLAN | Private IP | Public NAT IP | HTTP page must contain |
| --- | --- | --- | --- | --- |
| **Server0** | VLAN 10 (Office) | 10.0.10.2 /24, gw 10.0.10.1 | 100.1.1.3 | *Office Server* |
| **Server1** | VLAN 20 (Admin) | 10.0.20.2 /24, gw 10.0.20.1 | 100.1.1.4 | *Admin Server* |
| **Server2** | VLAN 30 (Staff) | 10.0.30.2 /24, gw 10.0.30.1 | 100.1.1.5 | *Staff Server* |

###### Physical Topology

Inside (private) Outside (public/WAN)  
Router0 Gi0/2 ── ManagedSwitch0 (trunk)  
├─ Fa0/2,Fa0/3,Fa0/4 VLAN10 ── Server0, PC0, PC1 (Office 10.0.10.0/24)  
├─ Fa0/5,Fa0/6,Fa0/7 VLAN20 ── Server1, PC2, PC3 (Admin 10.0.20.0/24)  
└─ Fa0/8,Fa0/9,Fa0/10 VLAN30 ── Server2, PC4, PC5 (Staff 10.0.30.0/24)  
Router0 Gi0/3 ═══crossover══ Router1 Gi0/0 (WAN 100.1.1.0/29)  
Router1 Gi0/1 ── ManagedSwitch1 ── PC6 (External 192.168.100.0/24)

Use a **crossover cable** for the Router0–Router1 WAN link.

###### ManagedSwitch0 — VLAN & Port Configuration

| Port | Mode | VLAN | Connected to |
| --- | --- | --- | --- |
| FastEthernet0/1 | trunk | all | Router0 Gi0/2 |
| Fa0/2, Fa0/3, Fa0/4 | access | VLAN 10 | Server0, PC0, PC1 |
| Fa0/5, Fa0/6, Fa0/7 | access | VLAN 20 | Server1, PC2, PC3 |
| Fa0/8, Fa0/9, Fa0/10 | access | VLAN 30 | Server2, PC4, PC5 |

VLAN names: VLAN 10 → **Office**, VLAN 20 → **Admin**, VLAN 30 → **Staff**.

###### Your Tasks

1. **Build the topology** — place all devices and connect them. Use a crossover cable for Router0 Gi0/3 → Router1 Gi0/0.
2. **Configure Router0 subinterfaces** — bring up Gi0/2 (no IP), then create Gi0/2.10, Gi0/2.20, Gi0/2.30 with `encapsulation dot1Q` and gateway IPs.
3. **Configure Router0 Gi0/3** (WAN) — IP 100.1.1.1, mask 255.255.255.248, bring up.
4. **Configure Router1 Gi0/0 and Gi0/1** — WAN IP 100.1.1.2/29, LAN IP 192.168.100.1/24, both up.
5. **Add default routes on both routers** — Router0 default next-hop 100.1.1.2, Router1 default next-hop 100.1.1.1. Use `ip route ?` to find the syntax.
6. **Create DHCP pools on Router0** — OFFICE (10.0.10.0/24), ADMIN (10.0.20.0/24), STAFF (10.0.30.0/24).
7. **Create DHCP pool EXTERNAL on Router1** — 192.168.100.0/24, gw 192.168.100.1.
8. **Configure VLANs on ManagedSwitch0** — create VLANs 10/20/30 with names, set Fa0/1 as trunk, assign access VLANs on Fa0/2–Fa0/10.
9. **Set static IPs on Server0, Server1, Server2** — enable HTTP and edit the index page.
10. **Mark NAT interfaces on Router0** — in each subinterface config, type `ip nat ?` and choose **inside**. On Gi0/3, choose **outside**.
11. **Add static NAT mappings on Router0** — three `ip nat inside source static <private> <public>` commands (one per server).
12. **Set PC0–PC5 and PC6 to DHCP mode**. Run `ipconfig` on each.

###### Verification Checklist

- Router0 CLI → `show ip nat translations` → three static entries visible ✓
- PC0 `ipconfig` → IP in **10.0.10.0/24**, gateway 10.0.10.1 ✓
- PC6 `ipconfig` → IP in **192.168.100.0/24**, gateway 192.168.100.1 ✓
- PC6 → Web Browser → **http://100.1.1.3** → *Office Server* page loads ✓
- PC6 → Web Browser → **http://100.1.1.4** → *Admin Server* page loads ✓

**Run `ipconfig` on every PC before clicking Run Tests** — the grader checks live DHCP lease state.

###### Hints (direction only — no commands)

- **NAT interface direction** is set inside the interface config mode (not global config). Enter `interface GigabitEthernet0/2.10` then type `ip nat ?`. Do this for each subinterface (inside) and for Gi0/3 (outside).
- **Static NAT mappings** are global config commands. Go back to global config (`exit` from interface mode or use `end` + `configure terminal`) and type `ip nat inside source static ?` to see the syntax.
- The **/29 mask** is 255.255.255.248. It gives only 6 usable hosts in 100.1.1.0/29 (addresses .1 through .6). The two routers use .1 and .2; the three NAT public IPs use .3, .4, .5.
- If PC6 can browse 100.1.1.3 but not 100.1.1.4, the NAT mapping or the Gi0/2.20 subinterface config for Server1 may be wrong check `show ip nat translations` and `show ip interface brief` on Router0.


