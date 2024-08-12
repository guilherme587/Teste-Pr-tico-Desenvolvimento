using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;

namespace WebAtividadeEntrevista.Controllers
{
    public class ClienteController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Incluir()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Incluir(ClienteModel model)
        {
            if (!ValidarCPF(model.CPF))
            {
                Response.StatusCode = 400;
                return Json("Erro: O CPF do cliente é inválido");
            }
            BoCliente bo = new BoCliente();
            
            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                if (bo.VerificarExistencia(model.CPF))
                {
                    Response.StatusCode = 400;
                    return Json("Erro: O CPF informado já está cadastrado.");
                }

                model.Id = bo.Incluir(new Cliente()
                {                    
                    CPF = model.CPF,
                    CEP = model.CEP,
                    Cidade = model.Cidade,
                    Email = model.Email,
                    Estado = model.Estado,
                    Logradouro = model.Logradouro,
                    Nacionalidade = model.Nacionalidade,
                    Nome = model.Nome,
                    Sobrenome = model.Sobrenome,
                    Telefone = model.Telefone
                });

                bool erro = false;
                string mensagem = string.Empty;
                if (model.Beneficiarios != null && model.Beneficiarios.Count > 0)
                {
                    for (int i = 0; i < model.Beneficiarios.Count; i++)
                    {
                        if (!ValidarCPF(model.Beneficiarios[i].CPF))
                        {
                            erro = true;
                            mensagem += "Erro: O CPF do beneficiário " + model.Beneficiarios[i].Nome + " é inválido. Favor insira um válido\n";
                            continue;
                        }
                        model.Beneficiarios[i].IdCliente = model.Id;
                        IncluirBeneficiario(model.Beneficiarios[i]);
                    }
                }
                if (erro)
                {
                    Response.StatusCode = 400;
                    return Json(mensagem);
                }

                return Json("Cadastro efetuado com sucesso");
            }
        }

        public string IncluirBeneficiario(BeneficiarioModel model)
        {
            BoBeneficiario bo = new BoBeneficiario();

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return string.Join(Environment.NewLine, erros);
            }
            else
            {
                if (bo.VerificarExistencia(model.CPF, model.IdCliente))
                {
                    return "Erro: O CPF do beneficiário " + model.Nome + " informado já está cadastrado\n";
                }

                model.Id = bo.Incluir(new Beneficiario()
                {
                    Nome = model.Nome,
                    CPF = model.CPF,
                    IdCliente = model.IdCliente
                });

                return "Cadastro efetuado com sucesso";
            }
        }

        [HttpPost]
        public JsonResult Alterar(ClienteModel model)
        {
            if (!ValidarCPF(model.CPF))
            {
                Response.StatusCode = 400;
                return Json("Erro: O CPF do cliente é inválido");
            }

            BoCliente bo = new BoCliente();
       
            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                if (bo.VerificarExistenciaDuplicadaCPF(model.CPF, model.Id))
                {
                    Response.StatusCode = 400;
                    return Json("Erro: O CPF informado já está cadastrado.");
                }
                bo.Alterar(new Cliente()
                {
                    Id = model.Id,
                    CPF = model.CPF,
                    CEP = model.CEP,
                    Cidade = model.Cidade,
                    Email = model.Email,
                    Estado = model.Estado,
                    Logradouro = model.Logradouro,
                    Nacionalidade = model.Nacionalidade,
                    Nome = model.Nome,
                    Sobrenome = model.Sobrenome,
                    Telefone = model.Telefone
                });

                ExcluirTodosBeneficiariosCliente(model.Id);

                bool erro = false;
                string mensagem = string.Empty;
                if (model.Beneficiarios != null && model.Beneficiarios.Count > 0)
                {
                    for (int i = 0; i < model.Beneficiarios.Count; i++)
                    {
                        if (!ValidarCPF(model.Beneficiarios[i].CPF))
                        {
                            erro = true;
                            mensagem += "Erro: O CPF do beneficiário " + model.Beneficiarios[i].Nome + " é inválido. Favor insira um válido\n";
                            continue;
                        }
                        model.Beneficiarios[i].IdCliente = model.Id;
                        IncluirBeneficiario(model.Beneficiarios[i]);
                    }
                }
                if (erro)
                {
                    Response.StatusCode = 400;
                    return Json(mensagem);
                }

                return Json("Cadastro alterado com sucesso");
            }
        }

        [HttpGet]
        public ActionResult Alterar(long id)
        {
            BoCliente bo = new BoCliente();
            Cliente cliente = bo.Consultar(id);
            Models.ClienteModel model = null;

            List<BeneficiarioModel> beneficiariosModel = new List<BeneficiarioModel>();
            List<Beneficiario> beneficiarios = new BoBeneficiario().Listar(cliente.Id);
            foreach (Beneficiario beneficiario in beneficiarios)
            {
                beneficiariosModel.Add(new BeneficiarioModel
                {
                    Id = beneficiario.Id,
                    CPF = beneficiario.CPF,
                    Nome = beneficiario.Nome,
                    IdCliente = beneficiario.IdCliente
                });
            }

            if (cliente != null)
            {
                model = new ClienteModel()
                {
                    Id = cliente.Id,
                    Beneficiarios = beneficiariosModel,
                    CPF = cliente.CPF,
                    CEP = cliente.CEP,
                    Cidade = cliente.Cidade,
                    Email = cliente.Email,
                    Estado = cliente.Estado,
                    Logradouro = cliente.Logradouro,
                    Nacionalidade = cliente.Nacionalidade,
                    Nome = cliente.Nome,
                    Sobrenome = cliente.Sobrenome,
                    Telefone = cliente.Telefone
                };

            
            }

            return View(model);
        }

        [HttpPost]
        public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                int qtd = 0;
                string campo = string.Empty;
                string crescente = string.Empty;
                string[] array = jtSorting.Split(' ');

                if (array.Length > 0)
                    campo = array[0];

                if (array.Length > 1)
                    crescente = array[1];

                List<Cliente> clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out qtd);

                //Return result to jTable
                return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        public void ExcluirTodosBeneficiariosCliente(long id)
        {
            BoBeneficiario bo = new BoBeneficiario();
            bo.ExcluirTodosBeneficiariosCliente(id);
        }

        public static bool ValidarCPF(string cpf)
        {
            cpf = cpf.Replace(".", "").Replace("-", "");

            if (cpf.Length != 11)
                return false;

            if (cpf.All(c => c == cpf[0]))
                return false;

            int[] multiplicadores1 = new int[9] { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            int soma = 0;
            for (int i = 0; i < 9; i++)
                soma += int.Parse(cpf[i].ToString()) * multiplicadores1[i];

            int resto = soma % 11;
            int digito1 = resto < 2 ? 0 : 11 - resto;

            int[] multiplicadores2 = new int[10] { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            soma = 0;
            for (int i = 0; i < 10; i++)
                soma += int.Parse(cpf[i].ToString()) * multiplicadores2[i];

            resto = soma % 11;
            int digito2 = resto < 2 ? 0 : 11 - resto;

            return cpf.EndsWith(digito1.ToString() + digito2.ToString());
        }
    }
}