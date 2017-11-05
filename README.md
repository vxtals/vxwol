# VxWol

Small web server for local network WOL.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

Working with node v6.9.5. Service mode is only available for Microsoft Windows right now. 

### Installing and using VxWol

Follow this steps to run VxWol:

```
npm install
```

and 

```
node vxwol
```
this starts a VxWol server at port 3030.

If you want to run the server as a Windows service on the background:

```
node vxwol --windows-service
```
this option hasn´t been thoroughly tested, use it with caution.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
